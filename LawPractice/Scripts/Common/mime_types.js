var MimeMapper = {
	mimeTypes : {
		//'default' : {'kind' : 'unknown', 'icon': 'fa-file', 'type': "" },

		//'folder' : {'kind' : 'folder', 'icon': 'fa-folder', 'type': "" },

		//'application/zip': {'kind' : 'compressed', 'icon': 'fa-file-archive-o', 'type': "" },
		
	    'audio/mpeg': { 'kind': 'audio', 'icon': 'fa-file-audio-o', 'type': "mpeg" },
		
	    'audio/mp3': { 'kind': 'audio', 'icon': 'fa-file-audio-o', 'type': "mp3" },

		//'application/x-ruby': {'kind' : 'text', 'icon': 'fa-file-code-o', 'type': "" },

		//'application/x-yaml': {'kind' : 'text', 'icon': 'fa-file-code-o', 'type': "" },

		//'application/javascript': {'kind' : 'text', 'icon': 'fa-file-code-o', 'type': "" },

		//'application/excel': {'kind' : 'office', 'icon': 'fa-file-excel-o', 'type': "" },

	    'image/gif': { 'kind': 'image', 'icon': 'fa-file-image-o', 'type': "gif" },

	    'video/mpeg': { 'kind': 'video', 'icon': 'fa-file-movie-o', 'type': "mpeg" },

		//'video/x-matroska': {'kind' : 'video', 'icon': 'fa-file-movie-o', 'type': "" },

		//'text/html': {'kind' : 'text', 'icon': 'fa-file-o', 'type': "" },

		//'text/css': {'kind' : 'text', 'icon': 'fa-file-o', 'type': "" },

		//'text/xml': {'kind' : 'text', 'icon': 'fa-file-o', 'type': "" },

	    'application/pdf': { 'kind': 'pdf', 'icon': 'fa-file-pdf-o', 'type': "pdf" },

	    'image/png': { 'kind': 'image', 'icon': 'fa-file-photo-o', 'type': "png" },

	    'image/jpeg': { 'kind': 'image', 'icon': ' fa-file-photo-o', 'type': "jpeg" },

	    'image/jpe': { 'kind': 'image', 'icon': ' fa-file-photo-o', 'type': "jpeg" },

	    'image/jpg': { 'kind': 'image', 'icon': 'fa-file-photo-o', 'type': "jpg" },

	    //'image/bmp': { 'kind': 'image', 'icon': 'fa-file-photo-o', 'type': "bmp" },

		//'application/powerpoint': {'kind' : 'office', 'icon': 'fa-file-powerpoint-o', 'type': "" },

		//'audio/basic': {'kind' : 'office', 'icon': 'fa-file-sound-o', 'type': "" },

		//'text/webviewhtml': {'kind' : 'text', 'icon': 'fa-file-text', 'type': "" },

		'text/plain': {'kind' : 'text', 'icon': 'fa-file-text-o', 'type': "txt" },

        'application/doc': { 'kind': 'office', 'icon': 'fa-file-word-o', 'type': "doc" },

        'application/docx': { 'kind': 'office', 'icon': 'fa-file-word-o', 'type': "docx" },

		//'application/x-tar': { 'kind': 'compressed', 'icon': 'fa-file-zip-o' , 'type': "mpeg" },

		'video/mp4': { 'kind': 'video', 'icon': 'fa-file-video-o', 'type': "mp4" },
		'video/wmv': { 'kind': 'video', 'icon': 'fa-file-video-o', 'type': "wmv" },

		'video/quicktime': { 'kind': 'video', 'icon': 'fa-file-video-o', 'type': "mov" }
	},
	getIcon: function(k){
		if(MimeMapper.mimeTypes[k]){
    		return MimeMapper.mimeTypes[k]['icon'];
		}
		else{
			return null;
		}
	},
	getIconByType: function (k) {
	    var d = null;
	    $.each(MimeMapper.mimeTypes, function(key, data) {
	        if (data["type"].toUpperCase() == k.toUpperCase()) {
	            d = data;
	            return;
	        }
	    });
	    if (d!=null) {
	        return d['icon'];
	    }
	    else {
	        return null;
	    }
	},
	getKind: function(k){
		if(MimeMapper.mimeTypes[k]){
			return MimeMapper.mimeTypes[k]['kind'];
		}
		else {
		    return null;//MimeMapper.mimeTypes['default']['kind'];	
		}
	},
	isSupported: function (mimeType) {
	    var kind = MimeMapper.getKind(mimeType);
	    /*var pattern = new RegExp(/\.*unknown*.|.*office*./);
        return pattern.test(kind);*/
	    return (kind != null);
	},
	getType: function (k) {
	    if (MimeMapper.mimeTypes[k]) {
	        return MimeMapper.mimeTypes[k]['type'];
	    }
	    else {
	        return null;//MimeMapper.mimeTypes['default']['kind'];	
	    }
	}
};