using System;
using System.Data.Entity;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;
using Mood_o_Meter.Hubs;
using Mood_o_Meter.Models;

namespace Mood_o_Meter.Controllers
{
    public class MoodController : Controller
    {
        private MoMContext db = new MoMContext();

        public ActionResult Index()
        {
            return View(db.Moods.OrderByDescending(m=>m.Timestamp));
        }

        [HttpPost]
        public ActionResult Create(string moood)
        {
            Mood mood = new Mood
            {
                Moood = moood,
                Timestamp = DateTime.Now,
                Username = GetUsername()
            };

            db.Moods.Add(mood);
            db.SaveChanges();

            IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<MoodHub>();
            hubContext.Clients.All.hello();

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpGet]
        public JsonResult GetMoods()
        {
            DbSet<Mood> moods = db.Moods;
            return Json(moods, JsonRequestBehavior.AllowGet);
        }


        private string GetUsername()
        {
            try
            {
                return GetUsernameFromAD();
            }
            catch (Exception)
            {
                return User.Identity.Name;
            }
        }

        private string GetUsernameFromAD()
        {
            using (PrincipalContext context = new PrincipalContext(ContextType.Domain))
            {
                UserPrincipal principal = UserPrincipal.FindByIdentity(context, User.Identity.Name);
                return principal.ToString();
            }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
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

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            ViewBag.Username = GetUsername();
        }
    }
}
