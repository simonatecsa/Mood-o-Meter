using System;
using System.Data.Entity;
using System.Diagnostics;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Web.Mvc;
using Mood_o_Meter.Models;

namespace Mood_o_Meter.Controllers
{
    public class MoodController : Controller
    {
        private readonly MoMContext _dbContext = new MoMContext();

        public ActionResult Index()
        {
            return View(_dbContext.Moods.OrderByDescending(m => m.Timestamp));
        }

        public ActionResult Details(Int32 id)
        {
            Mood mood = _dbContext.Moods.Find(id);

            if (mood == null)
            {
                return HttpNotFound();
            }

            return View(mood);
        }

        public ActionResult Create()
        {
            Mood mood = new Mood
            {
                Username = ObtainFullNameOfCurrentUser(),
                Timestamp = DateTime.Now
            };

            return View(mood);
        }

        private string ObtainFullNameOfCurrentUser()
        {
            string identityName = User.Identity.Name;

            try
            {
                return FetchFullNameOfCurrentUserFromDirectoryService(identityName);
            }
            catch
            {
                return identityName;
            }
        }

        private string FetchFullNameOfCurrentUserFromDirectoryService(string identityName)
        {
            using (PrincipalContext context = new PrincipalContext(ContextType.Domain))
            {
                UserPrincipal principal = UserPrincipal.FindByIdentity(context, identityName);
                Debug.Assert(principal != null);
                return principal.ToString();
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Mood mood)
        {
            if (ModelState.IsValid)
            {
                _dbContext.Moods.Add(mood);
                _dbContext.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(mood);
        }

        public ActionResult Edit(Int32 id)
        {
            Mood mood = _dbContext.Moods.Find(id);
            if (mood == null)
            {
                return HttpNotFound();
            }
            return View(mood);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Mood mood)
        {
            if (!ModelState.IsValid)
            {
                return View(mood);
            }

            _dbContext.Entry(mood).State = EntityState.Modified;
            _dbContext.SaveChanges();
            return RedirectToAction("Index");
        }

        public ActionResult Delete(Int32 id)
        {
            Mood mood = _dbContext.Moods.Find(id);

            if (mood == null)
            {
                return HttpNotFound();
            }

            return View(mood);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(Int32 id)
        {
            Mood mood = _dbContext.Moods.Find(id);
            _dbContext.Moods.Remove(mood);
            _dbContext.SaveChanges();

            return RedirectToAction("Index");
        }

        public ActionResult About()
        {
            ViewBag.Message = "Record your mood";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "You can contact us via email:";
            return View();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            // Of course, we should obtain the username only once, when the authenticated session starts.
            // Until coding that, obtain it on every web action call.
            ViewBag.Username = ObtainFullNameOfCurrentUser();
        }

        protected override void Dispose(bool disposing)
        {
            _dbContext.Dispose();
            base.Dispose(disposing);
        }
    }
}
