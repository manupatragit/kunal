using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace DataAccess.PocoRepositoryInterfaces
{
    public interface IPocoRepository<T> : IDisposable
     where T : class
    {
        /// <summary>
        /// Gets the count.
        /// </summary>
        int Count { get; }

        /// <summary>
        /// The all.
        /// </summary>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        IQueryable<T> All();

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="table">
        /// The table.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        IQueryable<T> All(string table);

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="predicate">
        /// The predicate.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        IQueryable<T> All(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="predicate">
        /// The predicate.
        /// </param>
        /// <param name="table">
        /// The table.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        IQueryable<T> All(Expression<Func<T, bool>> predicate, string table);

        /// <summary>
        /// The all.
        /// </summary>
        /// <param name="predicate">
        /// The predicate.
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
        IQueryable<T> All(Expression<Func<T, bool>> predicate, string table1, string table2);

        /// <summary>
        /// The filter.
        /// </summary>
        /// <param name="predicate">
        /// The predicate.
        /// </param>
        /// <returns>
        /// The <see cref="IQueryable"/>.
        /// </returns>
        IQueryable<T> Filter(Expression<Func<T, bool>> predicate);

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
        IQueryable<T> Filter(Expression<Func<T, bool>> filter, out int total, int index = 0, int size = 50);

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
        IQueryable<T> Filter(IQueryable<T> query, out int total, int index = 0, int size = 50);

        /// <summary>
        /// The contains.
        /// </summary>
        /// <param name="predicate">
        /// The predicate.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        bool Contains(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// The find.
        /// </summary>
        /// <param name="keys">
        /// The keys.
        /// </param>
        /// <returns>
        /// The <see cref="T"/>.
        /// </returns>
        T Find(params object[] keys);

        /// <summary>
        /// The find.
        /// </summary>
        /// <param name="predicate">
        /// The predicate.
        /// </param>
        /// <returns>
        /// The <see cref="T"/>.
        /// </returns>
        T Find(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// The create.
        /// </summary>
        /// <param name="t">
        /// The t.
        /// </param>
        /// <returns>
        /// The <see cref="T"/>.
        /// </returns>
        T Create(T t);

        /// <summary>
        /// The bulk create.
        /// </summary>
        /// <param name="objects">
        /// The objects.
        /// </param>
        /// <returns>
        /// The <see>
        ///         <cref>List</cref>
        ///     </see>
        ///     .
        /// </returns>
        List<T> BulkCreate(List<T> objects);

        /// <summary>
        /// The delete.
        /// </summary>
        /// <param name="t">
        /// The t.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        bool Delete(T t);

        /// <summary>
        /// The bulk delete.
        /// </summary>
        /// <param name="objects">
        /// The objects.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        bool BulkDelete(List<T> objects);

        /// <summary>
        /// The delete.
        /// </summary>
        /// <param name="Predicate">
        /// The predicate.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        bool Delete(Expression<Func<T, bool>> Predicate);

        /// <summary>
        /// The update.
        /// </summary>
        /// <param name="t">
        /// The t.
        /// </param>
        /// <param name="PkId">
        /// The Primary id.
        /// </param>
        /// <param name="save">
        /// The save.
        /// </param>
        void Update(T t, string PkId = null, bool save = true);

        /// <summary>
        /// The bulk update.
        /// </summary>
        /// <param name="t">
        /// The t.
        /// </param>
        /// <param name="PkId">
        /// The primary id.
        /// </param>
        void BulkUpdate(List<T> t, string PkId = null);

        /// <summary>
        /// The update.
        /// </summary>
        /// <param name="query">
        /// The query.
        /// </param>
        /// <returns>
        /// The <see cref="int"/>.
        /// </returns>
        int Update(IEnumerable<T> query);

        /// <summary>
        /// The detach.
        /// </summary>
        /// <param name="Obj">
        /// The object.
        /// </param>
        void Detach(T Obj);

        /// <summary>
        /// The execute procedure.
        /// </summary>
        /// <param name="ProcedureName">
        /// The procedure name.
        /// </param>
        /// <param name="InputParameters">
        /// The input parameters.
        /// </param>
        /// <param name="Outparameters">
        /// The out parameters.
        /// </param>
        /// <returns>
        /// The <see cref="Enumerable"/>.
        /// </returns>
        IEnumerable<T> ExecuteProcedure(string ProcedureName, Dictionary<object, object> InputParameters, string[] Outparameters = null);

        /// <summary>
        /// The execute command.
        /// </summary>
        /// <param name="ProcedureName">
        /// The procedure name.
        /// </param>
        /// <param name="Parameters">
        /// The parameters.
        /// </param>
        /// <returns>
        /// The <see cref="int"/>.
        /// </returns>
        decimal ExecuteCommand(string ProcedureName, Dictionary<object, object> InputParameters);
    }
}