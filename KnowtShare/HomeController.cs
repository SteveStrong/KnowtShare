using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShapeSignal
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return Redirect(Url.Content("~/Start.html"));
        }

        public ActionResult Start()
        {
            return Redirect(Url.Content("~/Start.html"));
        }

        public ActionResult Doc(string id)
        {
            if (id.EndsWith("knt", true, System.Globalization.CultureInfo.DefaultThreadCurrentCulture))
            {
                return Redirect(Url.Content("~/Diagram.html?doc=" + id));
            }

            return Index();
        }

        public ActionResult KnowtShare(string id)
        {
            return Redirect(Url.Content("~/KnowtView.html?session=" + id));
        }

        public ActionResult Knowtify(string id)
        {
            return Redirect(Url.Content("~/Knowtify.html?session=" + id));
        }

        public ActionResult Diagram()
        {
            return Redirect(Url.Content("~/Diagram.html"));
        }



        public ActionResult Invitations(string id)
        {
            return Redirect(Url.Content("~/Invitations.html?id=" + id));
        }

        public ActionResult Accentances(string id)
        {
            return Redirect(Url.Content("~/Accentances.html?id=" + id));
        }
    }
}
