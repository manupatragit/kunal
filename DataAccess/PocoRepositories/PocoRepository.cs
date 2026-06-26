using System.Data.Entity;
using DataAccess.PocoRepositoryInterfaces;

namespace DataAccess.PocoRepositories
{
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Text;
    using System.Data;
    using Modals;
    using System.Data.Common;
    using System.Dynamic;

    /// <summary>
    /// The database repository.
    /// </summary>
    /// <typeparam name="TObject">
    /// Object class
    /// </typeparam>
    public abstract class PocoRepository<TObject> : IPocoRepository<TObject>
         where TObject : class
    {
        /// <summary>
        /// The context.
        /// </summary>
        public DbContext Context;

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="PocoRepository{TObject}"/> class.
        /// </summary>
        protected PocoRepository()
        {
            Context = new ApplicationContext();
            // Context.Database.CommandTimeout = 540;
            Context.Database.CommandTimeout = 180;
        }

        #endregion Constructor

        #region Member Functions

        /// <summary>
        /// Gets the count.
        /// </summary>
        public virtual int Count
        {
            get
            {
                return DbSet.Count();
            }
        }

        #region Member

        /// <summary>
        /// Gets the database set.
        /// </summary>
        public DbSet<TObject> DbSet
        {
            get
            {
                return Context.Set<TObject>();
            }
        }
        #endregion Member

        /// <summary>
        /// The execute procedure.
        /// </summary>
        /// <param name="ProcedureName">
        /// The procedure name.
        /// </param>
        /// <param name="InputParameters">
        /// The input Parameters.
        /// </param>
        /// <param name="Outparameters">
        /// The out Parameters.
        /// </param>
        /// <returns>
        /// The <see>
        ///         <cref>IEnumerable</cref>
        ///     </see>
        ///     .
        /// </returns>
        /// <exception cref="Exception">
        /// </exception>
        public IEnumerable<TObject> ExecuteProcedure(
            string ProcedureName,
            Dictionary<object, object> InputParameters,
            string[] Outparameters = null)
        {
            try
            {
                var sb = new StringBuilder();
                var inParameters =
                    new object[InputParameters.Count + (Outparameters == null ? 0 : Outparameters.Length) + 3];
                sb.Append("EXEC " + ProcedureName + " ");
                var i = 0;

                foreach (var pm in InputParameters)
                {
                    sb.Append(" @" + pm.Key + ",");

                    var pr = new SqlParameter(Convert.ToString(pm.Key), pm.Value)
                    {
                        Direction =
                            ParameterDirection.Input
                    };
                    inParameters[i] = pr;
                    i++;
                }
                i = InputParameters.Count;
                if (Outparameters != null)
                {
                    foreach (var pm in Outparameters)
                    {
                        sb.Append(" @" + pm + " OUT,");
                        var pr = new SqlParameter(Convert.ToString(pm), string.Empty)
                        {
                            Direction =
                                ParameterDirection.Output,
                            Size = int.MaxValue,
                            SqlDbType = SqlDbType.VarChar
                        };
                        inParameters[i] = pr;
                        i++;
                    }
                }

                i = InputParameters.Count;

                sb.Append(" @" + "ErrorDescription" + " OUT,");
                var prout = new SqlParameter(Convert.ToString("ErrorDescription"), string.Empty)
                {
                    Direction =
                         ParameterDirection.Output,
                    Size = int.MaxValue,
                    SqlDbType = SqlDbType.VarChar
                };
                inParameters[i] = prout;
                i++;

                sb.Append(" @" + "ErrorCode" + " OUT,");
                prout = new SqlParameter(Convert.ToString("ErrorCode"), string.Empty)
                {
                    Direction =
                        ParameterDirection.Output,
                    Size = int.MaxValue,
                    SqlDbType = SqlDbType.VarChar
                };
                inParameters[i] = prout;
                i++;

                sb.Append(" @" + "Query" + " OUT,");
                prout = new SqlParameter(Convert.ToString("Query"), string.Empty)
                {
                    Direction =
                        ParameterDirection.Output,
                    Size = int.MaxValue,
                    SqlDbType = SqlDbType.VarChar
                };
                inParameters[i] = prout;

                var index = sb.ToString().LastIndexOf(',');
                if (index >= 0)
                {
                    sb.Remove(index, 1);
                }

                var result = Context.Database.SqlQuery<TObject>(sb.ToString(), inParameters).ToList();

                //check ErrorDescription is blank
                //if (Convert.ToString(inParameters[inParameters.Length - 2]) != string.Empty)
                //{
                //    throw new Exception(Convert.ToString(inParameters[InputParameters.Count - 3]));
                //}
                return result;
            }
            // ReSharper disable once RedundantCatchClause
            catch (Exception exception)
            {
                throw new Exception(exception.Message);
            }
        }

        public IEnumerable<dynamic> ExecuteCustomProcedure(
            string ProcedureName,
            Dictionary<object, object> InputParameters,
            string[] Outparameters = null)
        {
                var sb = new StringBuilder();
                
                sb.Append("EXEC " + ProcedureName + " ");

                foreach (var pm in InputParameters)
                {
                    sb.Append(" @" + pm.Key + ",");
                }
                if (Outparameters != null)
                {
                    foreach (var pm in Outparameters)
                    {
                        sb.Append(" @" + pm + " OUT,");
                    }
                }

                sb.Append(" @" + "ErrorDescription" + " OUT,");

                sb.Append(" @" + "ErrorCode" + " OUT,");

                sb.Append(" @" + "Query" + " OUT,");

                var index = sb.ToString().LastIndexOf(',');
                if (index >= 0)
                {
                    sb.Remove(index, 1);
                }

            using (var cmd = Context.Database.Connection.CreateCommand())
            {
                cmd.CommandText = sb.ToString();
                if (cmd.Connection.State != ConnectionState.Open) { cmd.Connection.Open(); }

                foreach (KeyValuePair<object, object> p in InputParameters)
                {
                    DbParameter dbParameter = cmd.CreateParameter();
                    dbParameter.ParameterName = Convert.ToString(p.Key);
                    dbParameter.Value = p.Value;
                    cmd.Parameters.Add(dbParameter);
                }

                DbParameter dbErrorDescription = cmd.CreateParameter();
                dbErrorDescription.ParameterName = Convert.ToString("ErrorDescription");
                dbErrorDescription.Direction = ParameterDirection.Output;
                dbErrorDescription.Size = int.MaxValue;
                cmd.Parameters.Add(dbErrorDescription);

                DbParameter dbErrorCode = cmd.CreateParameter();
                dbErrorCode.ParameterName = Convert.ToString("ErrorCode");
                dbErrorCode.Direction = ParameterDirection.Output;
                dbErrorCode.Size = int.MaxValue;
                cmd.Parameters.Add(dbErrorCode);

                DbParameter dbQuery = cmd.CreateParameter();
                dbQuery.ParameterName = Convert.ToString("Query");
                dbQuery.Direction = ParameterDirection.Output;
                dbQuery.Size = int.MaxValue;
                cmd.Parameters.Add(dbQuery);

                //using (var dataReader = cmd.ExecuteReader())
                //{
                //    while (dataReader.Read())
                //    {
                //        //var row = new ExpandoObject() as IDictionary<string, object>;
                //        //for (var fieldCount = 0; fieldCount < dataReader.FieldCount; fieldCount++)
                //        //{
                //        //    row.Add(dataReader.GetName(fieldCount), dataReader[fieldCount]);
                //        //}
                //        yield return row;
                //    }
                //}
                yield return dbQuery.Size;
            }
        }

        /// <summary>
        /// The execute command.
        /// </summary>
        /// <param name="ProcedureName">
        /// The procedure name.
        /// </param>
        /// <param name="InputParameters">
        /// The Parameters.
        /// </param>
        /// <returns>
        /// The <see cref="int"/>.
        /// </returns>
        public decimal ExecuteCommand(string ProcedureName, Dictionary<object, object> InputParameters)
        {
            try
            {
                var sb = new StringBuilder();
                var inParameters = new object[InputParameters.Count];
                sb.Append("EXEC " + ProcedureName + " ");
                var i = 0;

                foreach (var pm in InputParameters)
                {
                    sb.Append(" @" + pm.Key + ",");
                    inParameters[i] = new SqlParameter(Convert.ToString(pm.Key), pm.Value);
                    i++;
                }

                //if (Outparameters != null)
                //{
                //    foreach (var pm in Outparameters)
                //    {
                //        sb.Append(" @" + pm + " OUT,");
                //    }
                //}
                var index = sb.ToString().LastIndexOf(',');
                if (index >= 0)
                {
                    sb.Remove(index, 1);
                }

                var result = Context.Database.ExecuteSqlCommand(sb.ToString(), inParameters);

                //var result1 = DbSet.SqlQuery(sb.ToString());
                //IEnumerable<object> result = result1.ToList();
                return result;
            }
            // ReSharper disable once RedundantCatchClause
            catch (Exception)
            {
                throw;
            }

            //var sb = new StringBuilder();
            //var inParameters = new object[Parameters.Count];
            //sb.Append(ProcedureName + " ");
            //var i = 0;

            //foreach (var pm in Parameters)
            //{
            //    sb.Append(" @" + pm.Key + "={" + Convert.ToString(i) + "},");
            //    inParameters[i] = new SqlParameter(" @" + pm.Key, pm.Value);
            //    i++;
            //}
            //var index = sb.ToString().LastIndexOf(',');
            //if (index >= 0)
            //{
            //    sb.Remove(index, 1);
            //}
            //var value = Context.Database.ExecuteSqlCommand(sb.ToString(), inParameters);
            //return value;
        }

        /// <summary>
        /// The all.
        /// </summary>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public virtual IQueryable<TObject> All()
        {
            //Refresh();
            return DbSet.AsQueryable();
        }

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="table">
        /// The table.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public virtual IQueryable<TObject> All(string table)
        {
            return DbSet.AsQueryable().Include(table);
        }

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="predicate">
        /// The Predicate.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public virtual IQueryable<TObject> All(Expression<Func<TObject, bool>> predicate)
        {
            return DbSet.Where(predicate).AsQueryable();
        }

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="predicate">
        /// The Predicate.
        /// </param>
        /// <param name="table">
        /// The table.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public IQueryable<TObject> All(Expression<Func<TObject, bool>> predicate, string table)
        {
            return DbSet.Where(predicate).Include(table);
        }

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="predicate">
        /// The Predicate.
        /// </param>
        /// <param name="table1">
        /// The table 1.
        /// </param>
        /// <param name="table2">
        /// The table 2.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public IQueryable<TObject> All(Expression<Func<TObject, bool>> predicate, string table1, string table2)
        {
            return DbSet.Where(predicate).Include(table1).Include(table2);
        }

        /// <summary>
        /// The filter.
        /// </summary>
        /// <param name="predicate">
        /// The Predicate.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public virtual IQueryable<TObject> Filter(Expression<Func<TObject, bool>> predicate)
        {
            return DbSet.Where(predicate).AsQueryable();
        }

        /// <summary>
        /// The filter.
        /// </summary>
        /// <param name="filter">
        /// The filter.
        /// </param>
        /// <param name="total">
        /// The total.
        /// </param>
        /// <param name="index">
        /// The index.
        /// </param>
        /// <param name="size">
        /// The size.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public virtual IQueryable<TObject> Filter(Expression<Func<TObject, bool>> filter, out int total, int index = 0, int size = 50)
        {
            var query = filter != null ? DbSet.Where(filter).AsQueryable() : DbSet.AsQueryable();

            return Filter(query, out total, index, size);
        }

        /// <summary>
        /// The filter.
        /// </summary>
        /// <param name="query">
        /// The query.
        /// </param>
        /// <param name="total">
        /// The total.
        /// </param>
        /// <param name="index">
        /// The index.
        /// </param>
        /// <param name="size">
        /// The size.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        public virtual IQueryable<TObject> Filter(IQueryable<TObject> query, out int total, int index = 0, int size = 50)
        {
            var skipCount = index * size;
            var resetSet = skipCount == 0 ? query.Take(size) : query.Skip(skipCount).Take(size);
            total = resetSet.Count();
            return resetSet.AsQueryable();
        }

        /// <summary>
        /// The contains.
        /// </summary>
        /// <param name="predicate">
        /// The Predicate.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public bool Contains(Expression<Func<TObject, bool>> predicate)
        {
            return DbSet.Count(predicate) > 0;
        }

        /// <summary>
        /// The find.
        /// </summary>
        /// <param name="keys">
        /// The keys.
        /// </param>
        /// <returns>
        /// The <see cref="TObject"/>.
        /// </returns>
        public virtual TObject Find(params object[] keys)
        {
            return DbSet.Find(keys);
        }

        /// <summary>
        /// The find.
        /// </summary>
        /// <param name="predicate">
        /// The Predicate.
        /// </param>
        /// <returns>
        /// The <see cref="TObject"/>.
        /// </returns>
        public virtual TObject Find(Expression<Func<TObject, bool>> predicate)
        {
            return DbSet.FirstOrDefault(predicate);
        }

        /// <summary>
        /// The create.
        /// </summary>
        /// <param name="TObject">
        /// The t object.
        /// </param>
        /// <returns>
        /// The <see cref="TObject"/>.
        /// </returns>
        public virtual TObject Create(TObject TObject)
        {
            TObject newEntry;
            try
            {
                newEntry = DbSet.Add(TObject);
                Context.SaveChanges();
                Refresh();
            }
            // ReSharper disable once RedundantCatchClause
            catch (Exception)
            {
                throw;
            }

            return newEntry;
        }

        /// <summary>
        /// The bulk create.
        /// </summary>
        /// <param name="objects">
        /// The objects.
        /// </param>
        /// <returns>
        /// The <see cref="object"/>.
        /// </returns>
        public virtual List<TObject> BulkCreate(List<TObject> objects)
        {
            var entries = objects.Select(TObject => DbSet.Add(TObject)).ToList();

            Context.SaveChanges();
            Refresh();
            return entries;
        }

        /// <summary>
        /// The delete.
        /// </summary>
        /// <param name="TObject">
        /// The t object.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public virtual bool Delete(TObject TObject)
        {
            DbSet.Remove(TObject);
            Context.SaveChanges();
            Refresh();
            return true;
        }

        /// <summary>
        /// The bulk delete.
        /// </summary>
        /// <param name="objects">
        /// The objects.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public virtual bool BulkDelete(List<TObject> objects)
        {
            // ReSharper disable once NotAccessedVariable
            var x = objects.Select(TObject => DbSet.Remove(TObject));
            // ReSharper disable once RedundantAssignment
            x = null;

            //DbSet.Remove(TObject);
            Context.SaveChanges();
            Refresh();
            return true;
        }

        /// <summary>
        /// The update.
        /// </summary>
        /// <param name="TObject">
        /// The t object.
        /// </param>
        /// <param name="PkId">
        /// The primary key id.
        /// </param>
        /// <param name="save">
        /// The save.
        /// </param>
        public virtual void Update(TObject TObject, string PkId = null, bool save = true)
        {
            var entry = Context.Entry(TObject);

            // Retreive the Id through reflection
            var id = DbSet.Create().GetType().GetProperty("Id");
            object pkey;

            //var baseType = TObject.GetType().BaseType;
            if (!string.IsNullOrEmpty(PkId))
            {
                pkey = DbSet.Create().GetType().GetProperty(PkId).GetValue(TObject);
            }
            else
            {
                pkey = id != null ? DbSet.Create().GetType().GetProperty("Id").GetValue(TObject) : DbSet.Create().GetType().GetProperty("ID").GetValue(TObject);
            }

            if (entry.State == EntityState.Detached)
            {
                var set = Context.Set<TObject>();
                TObject attachedEntity = set.Find(pkey);  // access the key
                if (attachedEntity != null)
                {
                    var attachedEntry = Context.Entry(attachedEntity);
                    attachedEntry.CurrentValues.SetValues(TObject);
                }
                else
                {
                    entry.State = EntityState.Modified; // attach the entity
                }
            }
            if (save)
            {
                Context.SaveChanges();
                try
                {
                    Refresh();
                }
                // ReSharper disable once EmptyGeneralCatchClause
                catch (Exception)
                {
                }
            }
        }

        /// <summary>
        /// The bulk update.
        /// </summary>
        /// <param name="TObject">
        /// The t object.
        /// </param>
        /// <param name="PkId">
        /// The primary key id.
        /// </param>
        public virtual void BulkUpdate(List<TObject> TObject, string PkId = null)
        {
            foreach (var o in TObject)
            {
                Update(o, PkId, false);
            }

            Context.SaveChanges();
            try
            {
                Refresh();
            }
            // ReSharper disable once EmptyGeneralCatchClause
            catch (Exception)
            {
            }
        }

        /// <summary>
        /// The delete.
        /// </summary>
        /// <param name="Predicate">
        /// The predicate.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public virtual bool Delete(Expression<Func<TObject, bool>> Predicate)
        {
            var objects = Filter(Predicate);
            foreach (var obj in objects)
            {
                DbSet.Remove(obj);
            }
            Context.SaveChanges();
            return true;
        }

        /// <summary>
        /// The update.
        /// </summary>
        /// <param name="query">
        /// The query.
        /// </param>
        /// <returns>
        /// The <see cref="int"/>.
        /// </returns>
        public virtual int Update(IEnumerable<TObject> query)
        {
            var entry = Context.Entry(query);

            entry.State = EntityState.Modified;
            var x = Context.SaveChanges();
            return x;
        }

        /// <summary>
        /// Remove Object 
        /// </summary>
        /// <param name="Obj">
        /// The object.
        /// </param>
        public virtual void Detach(TObject Obj)
        {
            Context.Entry(Obj).State = EntityState.Detached;
        }

        /// <summary>
        /// The dispose.
        /// </summary>
        public void Dispose()
        {
            if (Context != null)
            {
                Context.Dispose();
            }
        }

        #endregion Member Functions

        /// <summary>
        /// The refresh.
        /// </summary>
        private void Refresh()
        {
            try
            {
                /*var context = ((IObjectContextAdapter)Context).ObjectContext;
                var refreshableObjects = Context.ChangeTracker.Entries().Select(c => c.Entity).ToList();
                context.Refresh(RefreshMode.StoreWins, refreshableObjects);
                context.SaveChanges();*/
                //foreach (var x in DbSet)
                //{
                //    Context.Entry(x).State = EntityState.Detached;
                //}
                //DbSet.Load();
                var entity = Context.ChangeTracker.Entries().Select(c => c.Entity).ToList();
                Context.Entry(entity).Reload();
            }
            // ReSharper disable once EmptyGeneralCatchClause
            catch (Exception)
            {
            }
        }
    }
}
