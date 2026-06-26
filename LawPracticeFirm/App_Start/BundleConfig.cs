using System;
using System.Configuration;
using System.Web.Optimization;

namespace LawPracticeFirm
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
                "~/Scripts/Plugin/dropdown.js*",
                "~/Scripts/Plugin/upload.js"
                ));


            bundles.Add(new ScriptBundle("~/bundles/Utility").Include(
                "~/Scripts/linq.min.js",
                "~/Scripts/Common/Messages.js",
                "~/Scripts/Common/mime_types.js",
                "~/Scripts/Common/ModulePermission.js",
                "~/Scripts/Common/Utility.js"
            ));

            bundles.Add(new StyleBundle("~/bundles/FirmCss").Include(
                "~/Content/Firm/style.css",
                "~/Content/Site.css"
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
                "~/Content/bootstrap-toggle.min.css",
                "~/Content/upload.css"
            ));


            bundles.Add(new StyleBundle("~/bundles/responsiveCss").Include(
                "~/Content/responsive.css"
            ));
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
               "~/EScripts/jquery-{version}.js",
               "~/EScripts/jquery-ui.js",
               "~/EScripts/jquery.blockUI.js",
               "~/EScripts/jquery.iframe-transport.js",
               "~/EScripts/jquery.fileupload.js",
               "~/EScripts/jquery.dropdownToggle.js"
                           ));

            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/EScripts/jscript.js"
                            ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/stylesheet.css",
                "~/Content/jquery-ui.css"
                            ));

            bundles.Add(new StyleBundle("~/Content/editor").Include(
                "~/Content/editor.css"
                            ));

            bundles.Add(new StyleBundle("~/bundles/Datacss").Include("~/Content/datatables.min.css"));
            bundles.Add(new ScriptBundle("~/bundles/Datajs").Include("~/Scripts/datatables.min.js"));

            bundles.Add(new StyleBundle("~/bundles/uploadcss").Include("~/Content/upload.css"));

            var env = Convert.ToString(ConfigurationManager.AppSettings["production"]);
            BundleTable.EnableOptimizations = !string.IsNullOrEmpty(env.Trim()) && Convert.ToBoolean(env);
        }
    }
}
