using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using DataAccess.Modals;

namespace LawPracticeFirm.Controllers
{
    public class AuditErrorsController : Controller
    {
        private LawPracticeEntities db = new LawPracticeEntities();

        /// <summary>
        /// Get auditor error
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View(db.AuditErrors.OrderByDescending(x=>x.ID).ToList());
        }

        /// <summary>
        /// Get auditor details by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Details(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AuditError auditError = db.AuditErrors.Find(id);
            if (auditError == null)
            {
                return HttpNotFound();
            }
            return View(auditError);
        }

        /// <summary>
        /// Create auditor
        /// </summary>
        /// <returns></returns>
        public ActionResult Create()
        {
            return View();
        }

        // POST: AuditErrors/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID,EventTypeId,SeverityId,RequestTypeId,Sevirity,RequestType,EventType,Details,EventTime,CreatedBy,IPAddress,MACAddress,LogType,Remark")] AuditError auditError)
        {
            if (ModelState.IsValid)
            {
                db.AuditErrors.Add(auditError);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(auditError);
        }

        /// <summary>
        /// Edit auditor details
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Edit(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AuditError auditError = db.AuditErrors.Find(id);
            if (auditError == null)
            {
                return HttpNotFound();
            }
            return View(auditError);
        }

        /// <summary>
        /// Edit auditor by Id
        /// </summary>
        /// <param name="auditError"></param>
        /// <returns></returns>
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID,EventTypeId,SeverityId,RequestTypeId,Sevirity,RequestType,EventType,Details,EventTime,CreatedBy,IPAddress,MACAddress,LogType,Remark")] AuditError auditError)
        {
            if (ModelState.IsValid)
            {
                db.Entry(auditError).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(auditError);
        }

        /// <summary>
        /// Delete auditor by Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult Delete(long? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AuditError auditError = db.AuditErrors.Find(id);
            if (auditError == null)
            {
                return HttpNotFound();
            }
            return View(auditError);
        }

        /// <summary>
        /// Permanent delete auditor details
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(long id)
        {
            AuditError auditError = db.AuditErrors.Find(id);
            db.AuditErrors.Remove(auditError);
            db.SaveChanges();
            return RedirectToAction("Index");
        }
        /// <summary>
        /// Dispose
        /// </summary>
        /// <param name="disposing"></param>
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
