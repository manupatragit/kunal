using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using DataAccess.Modals;

namespace LawApiPractice.Controllers
{
    public class AddContactsListController : ApiController
    {
        private LawPracticeEntities db = new LawPracticeEntities();

        // GET: api/AddContactsList
        public IQueryable<AddContactsList> GetAddContactsLists()
        {
            return db.AddContactsLists;
        }

        // GET: api/AddContactsList/5
        [ResponseType(typeof(AddContactsList))]
        public IHttpActionResult GetAddContactsList(long id)
        {
            AddContactsList addContactsList = db.AddContactsLists.Find(id);
            if (addContactsList == null)
            {
                return NotFound();
            }

            return Ok(addContactsList);
        }

        // PUT: api/AddContactsList/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAddContactsList(long id, AddContactsList addContactsList)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id.ToString() != addContactsList.cid.ToString())
            {
                return BadRequest();
            }

            db.Entry(addContactsList).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddContactsListExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/AddContactsList
        [ResponseType(typeof(AddContactsList))]
        public IHttpActionResult PostAddContactsList(AddContactsList addContactsList)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AddContactsLists.Add(addContactsList);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = addContactsList.cid }, addContactsList);
        }

        // DELETE: api/AddContactsList/5
        [ResponseType(typeof(AddContactsList))]
        public IHttpActionResult DeleteAddContactsList(long id)
        {
            AddContactsList addContactsList = db.AddContactsLists.Find(id);
            if (addContactsList == null)
            {
                return NotFound();
            }

            db.AddContactsLists.Remove(addContactsList);
            db.SaveChanges();

            return Ok(addContactsList);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AddContactsListExists(long id)
        {
            return db.AddContactsLists.Count(e => e.cid.ToString() == id.ToString()) > 0;
        }
    }
}