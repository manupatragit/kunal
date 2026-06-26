var ModulePermission = {
    checkModule: function (modules,modulename) {
        if (!$.isArray(modules)) {
            return null;
        }
        else {
            var module = modules.filter(function (p) {
                return p.ModuleName.toUpperCase() === modulename.toUpperCase();
            });
            if (module.length>0) {
                return module[0];
            }
            return null;
        }
    },
    checkPermission: function (permissions, permissionname) {
        if (!$.isArray(permissions)) {
            return null;
        }
        else {
            var p = permissions.filter(function (p) {
                return p.toUpperCase() === permissionname.toUpperCase();
            });
            if (p.length > 0) {
                return p[0];
            }
            return null;
        }
    }
    
};