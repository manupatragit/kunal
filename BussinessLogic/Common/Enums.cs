namespace BussinessLogic.Common
{
    class Enums
    {
    }
    /// <summary>
    /// Assign right
    /// </summary>
    public enum AccessRight
    {
        Create = 1,
        Read,
        Manage,
        Delete,
        ManageDoc,
        ManageTeamUser,
        ManageTeamInfo,
        ViewDoc,
        DownloadDoc,
        ShareDoc,
        ManageReports
    }
    /// <summary>
    /// Module
    /// </summary>
    public enum Module
    {
        Users = 1,
        Matters,
        Team,
        Firm
    }
    /// <summary>
    /// Module type
    /// </summary>
    public enum ModuleType
    {
        User = 1,
        Case = 2,
        Task = 3,
        Event = 4,
        Client = 5,
        Custom = 6
    }
    /// <summary>
    /// URL
    /// </summary>
    public enum Url
    {
        CaseList=1,
        UserList=2,
        FirmDetails=3,
        CaseFields = 4,
        UserFields = 5,
        ClientFields = 6,
        TaskFields = 7,
        EventFields = 8,
        CaseDetail = 9,
        UserDetail = 10,
        ClientDetail = 11,
        TaskDetail = 12,
        EventDetail = 13,
    }
}
