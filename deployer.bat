cd D:\Users\aialenti\Desktop\FormIO\formio.js
rd /s /q D:\Users\aialenti\Desktop\FormIO\formio.js\dist
call gulp build
call git add .
call git commit -a -m "commit"
call git push

cd D:\Users\aialenti\Desktop\FormIO\formio
rd /s /q D:\Users\aialenti\Desktop\FormIO\formio\node_modules\formiojs
call npm install
call gulp build
call git add .
call git commit -a -m "commit"
call git push

cd D:\Users\aialenti\Desktop\FormIO\ngFormio
rd /s /q D:\Users\aialenti\Desktop\FormIO\ngFormio\dist
rd /s /q D:\Users\aialenti\Desktop\FormIO\ngFormio\node_modules\formiojs
call npm install
call bower install
call gulp build
call git add .
call git commit -a -m "commit"
call git push

:: ok
cd D:\Users\aialenti\Desktop\FormIO\ng2-formio
rd /s /q D:\Users\aialenti\Desktop\FormIO\ngFormio\dist
rd /s /q D:\Users\aialenti\Desktop\FormIO\ngFormio\node_modules\formiojs
rd /s /q D:\Users\aialenti\Desktop\FormIO\ng2-formio\node_modules\formio
call npm install
call bower install
call gulp build
call git add .
call git commit -a -m "commit"
call git push

:: ok
cd D:\Users\aialenti\Desktop\FormIO\ngFormBuilder
rd /s /q D:\Users\aialenti\Desktop\FormIO\ngFormBuilder\node_modules\formiojs
rd /s /q D:\Users\aialenti\Desktop\FormIO\ngFormBuilder\node_modules\ng-formio
call npm install
call bower install
call gulp build
call git add .
call git commit -a -m "commit"
call git push

cd D:\Users\aialenti\Desktop\FormIO\formio-app-formio
rd /s /q D:\Users\aialenti\Desktop\FormIO\formio-app-formio\bower_components\ng-formio
call bower install
call gulp build
call git add .
call git commit -a -m "commit"
call git push

cd "D:\OneDrive\OneDrive - ICONSULTING S.p.A\Progetti\HSD - Gestionale\FormIO\hsd-form-io"
rd /s /q "D:\OneDrive\OneDrive - ICONSULTING S.p.A\Progetti\HSD - Gestionale\FormIO\hsd-form-io\client"
node main