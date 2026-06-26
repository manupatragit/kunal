using DataAccess.Modals;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace LawPracticeFirm.Controllers
{
    public class AuditsController : Controller
    {
        private LawPracticeEntities db = new LawPracticeEntities();
        /// <summary>
        /// Audit
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View(db.Audits.OrderByDescending(x => x.ID).ToList());
        }
        /// <summary>
        /// Get audit detail by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Audit audit = db.Audits.Find(id);
            if (audit == null)
            {
                return HttpNotFound();
            }
            return View(audit);
        }
        /// <summary>
        /// Create new audit detail
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            return View();
        }
        /// <summary>
        /// Save audit details 
        /// </summary>
        /// <param name="audit"></param>
        /// <returns></returns>
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,EventTypeId,SeverityId,RequestTypeId,Sevirity,RequestType,EventType,Details,EventTime,CreatedBy,IPAddress,MACAddress,LogType,Remark")] Audit audit)
        {
            if (ModelState.IsValid)
            {
                db.Audits.Add(audit);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(audit);
        }
        /// <summary>
        /// Edit audit by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Audit audit = db.Audits.Find(id);
            if (audit == null)
            {
                return HttpNotFound();
            }
            return View(audit);
        }
        /// <summary>
        /// Edit audit by Id
        /// </summary>
        /// <param name="audit"></param>
        /// <returns></returns>
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,EventTypeId,SeverityId,RequestTypeId,Sevirity,RequestType,EventType,Details,EventTime,CreatedBy,IPAddress,MACAddress,LogType,Remark")] Audit audit)
        {
            if (ModelState.IsValid)
            {
                db.Entry(audit).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(audit);
        }
        /// <summary>
        /// Delete audit
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Audit audit = db.Audits.Find(id);
            if (audit == null)
            {
                return HttpNotFound();
            }
            return View(audit);
        }
        // POST: Audits/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(long id)
        {
            Audit audit = db.Audits.Find(id);
            db.Audits.Remove(audit);
            db.SaveChanges();
            return RedirectToAction("Index");
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
