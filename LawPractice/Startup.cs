using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LawPractice.Startup))]
namespace LawPractice
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
