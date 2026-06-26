using System;
using System.Configuration;
using System.Web.Optimization;

namespace LawPractice
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/Common").Include(
                "~/Scripts/plugins.js",
                "~/Scripts/slick.min.js",
                "~/Scripts/footer-reveal.min.js",
                "~/Scripts/active.js"
            ));
            bundles.Add(new ScriptBundle("~/bundles/jQueryBootStrap").Include(
                "~/Scripts/jquery-2.2.4.min.js",
                "~/Scripts/popper.min.js",
                "~/Scripts/bootstrap.min.js",
                "~/Scripts/bootstrap-toggle.min.js",
                "~/Scripts/jquery-ui.min.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/Security").Include(
                "~/Scripts/AES.js*"));

            bundles.Add(new ScriptBundle("~/bundles/plugin").Include(
                "~/Scripts/Plugin/dropdown.js*"));


            bundles.Add(new ScriptBundle("~/bundles/Utility").Include(
                "~/Scripts/linq.min.js",
                "~/Scripts/Common/Messages.js",
                "~/Scripts/Common/mime_types.js",
                "~/Scripts/Common/ModulePermission.js",
                "~/Scripts/Common/Utility.js"
            ));

            bundles.Add(new StyleBundle("~/bundles/applicationCss").Include(
                        "~/Content/Application/style.css"
                       ));

            bundles.Add(new StyleBundle("~/bundles/jQueryBootStrapCss").Include(
               "~/Content/bootstrap.min.css",
               "~/Content/animate.css",
               "~/Content/magnific-popup.css",
               "~/Content/owl.carousel.min.css",
               "~/Content/slick.css",
               "~/Content/font-awesome.min.css",
               "~/Content/themify-icons.css",
               "~/Content/ionicons.min.css",
               "~/Content/bootstrap-toggle.min.css"
           ));


            bundles.Add(new StyleBundle("~/bundles/responsiveCss").Include(
                "~/Content/responsive.css"
            ));


            bundles.Add(new StyleBundle("~/bundles/Datacss").Include("~/Content/datatables.min.css"));
            bundles.Add(new ScriptBundle("~/bundles/Datajs").Include("~/Scripts/datatables.min.js"));

            var env = Convert.ToString(ConfigurationManager.AppSettings["production"]);
            BundleTable.EnableOptimizations = !string.IsNullOrEmpty(env.Trim()) && Convert.ToBoolean(env);

        }
    }
}
