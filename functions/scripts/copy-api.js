const fs = require('fs');
const path = require('path');

// Paths
const apiDistPath = path.join(__dirname, '../../api/dist');
const functionsSrcPath = path.join(__dirname, '../src');
const functionsLibPath = path.join(__dirname, '../lib');
const apiSrcPath = path.join(functionsSrcPath, 'api');
const apiLibPath = path.join(functionsLibPath, 'api');

// Function to copy directory recursively
function copyDir(src, dest, filterExtensions = null) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filterExtensions);
    } else {
      // Apply filter if provided
      if (!filterExtensions || filterExtensions.some(ext => entry.name.endsWith(ext))) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Copy api/dist to functions/src/api (for TypeScript compilation)
// and to functions/lib/api (for runtime)
if (fs.existsSync(apiDistPath)) {
  console.log('📦 Copying api/dist to functions/src/api and functions/lib/api...');
  
  // Copy to src/api (TypeScript needs .js and .d.ts files for module resolution)
  copyDir(apiDistPath, apiSrcPath, ['.js', '.d.ts']);
  console.log('✅ API files copied to src/api for TypeScript');
  
  // Copy to lib/api (runtime needs .js files)
  copyDir(apiDistPath, apiLibPath, ['.js']);
  console.log('✅ API files copied to lib/api for runtime');
  
  console.log('✅ API files copied successfully');
} else {
  console.error('❌ Error: api/dist directory not found. Make sure to build api first.');
  process.exit(1);
}

