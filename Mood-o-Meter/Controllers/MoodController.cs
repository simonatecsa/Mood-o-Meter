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
            string fullName;
            using (PrincipalContext context = new PrincipalContext(ContextType.Domain))
            {
                UserPrincipal principal = UserPrincipal.FindByIdentity(context, User.Identity.Name);
                Debug.Assert(principal != null);
                fullName = principal.ToString();
            }

            Mood mood = new Mood
            {
                Username = fullName,
                Timestamp = DateTime.Now
            };

            return View(mood);
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

        protected override void Dispose(bool disposing)
        {
            _dbContext.Dispose();
            base.Dispose(disposing);
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
    }
}
