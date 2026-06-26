
    

       $('#incfont').click(function () {
           
                modifyFontSize('increase', 0.002);
               
            });

            $('#decfont').click(function () {
                modifyFontSize('decrease', -0.002);
            });

            $('#resetfont').click(function () {
                $('body').css({ zoom: 1, '-moz-transform': 'scale(1,1)' });
            })
            var temzoomsize = 1;
            var clickcountin = 0;
            var clickcountde = 0;
var currentzoomSize = temzoomsize;
zoomLevel = 1;
       function modifyFontSize(flag, zoom) {
                
           
                if (flag == 'increase') {
                
                       
                    
                    if (clickcountin < 3) {
                        currentzoomSize += 2;
                        temzoomsize = currentzoomSize;
                        zoomLevel += zoom;
                       
                        $('body').css({ zoom: zoomLevel, '-moz-transform': 'scale(' + zoomLevel + ')' });
                        clickcountin = parseInt(clickcountin)+1;
                        clickcountde = 0;
                    }
                }

                else if (flag == 'decrease') {
                    
                    if (clickcountde < 3) {
                        currentzoomSize -= 2;
                        temzoomsize = currentzoomSize;
                        zoomLevel += zoom;

                        $('body').css({ zoom: zoomLevel, '-moz-transform': 'scale(' + zoomLevel + ')' });
                        clickcountde = parseInt(clickcountde) + 1;
                        clickcountin = 0;
                    }
                }
                else {
                     clickcountin = 0;
                     clickcountde = 0;
                    temzoomsize = 100;
                    $('body').css({ zoom: 1, '-moz-transform': 'scale(1,1)' });
                }

                
            }
