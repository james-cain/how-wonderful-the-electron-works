const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const { resolve } = require('path');

let window = null;

// ipcMain模块是EventEmitter类的一个实例。
// 当在主进程中使用时，它处理从渲染器进程（网页）发送出来的异步和同步信息。
// 从渲染器进程发送的消息将被发送到该模块。
// 主进程ipcMain注册消息监听，渲染进程ipcRenderer通过同步或异步的方式往主进程发送消息，也可以接收主进程回复的消息
function ipcMessager() {}

const menus = Menu.buildFromTemplate([
  {
    label: 'help',
    submenu: [{
      label: 'about',
      click() {
        // 使用默认应用程序管理文件和url
        shell.openExternal('https://github.com/james-cain/how-wonderful-the-electron-works');
      },
    }, {
      type: 'separator',
    }, {
      role: 'toggledevtools',
    }, {
      role: 'reload',
    }, {
      role: 'quit',
    }],
  }
]);

async function createWindow() {
  Menu.setApplicationMenu(menus);

  window = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: '#2e2c29',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  ipcMessager();

  window.setResizable(false);
  // 以下事件在简单应用里使用不会因为发出太晚而感觉缓慢；
  // 在复杂的应用中就相反了，此时可以使用接近应用程序背景的backgroundColor
  // 建议即使使用ready-to-show事件的应用程序，也应该设置backgroundColor使应用程序感觉更原生
  window.once('ready-to-show', () => {
    window.show();
  });

  if (process.env.NODE_ENV === 'DEV') {
    // loadURL(url[, options]) url 可以是远程地址 (例如 http://),也可以是 file:// 协议的本地HTML文件的路径
    // 为了确保文件网址格式正确，建议使用Node的url.format方法
    // let url = require('url').format({
    //   protocol: 'file',
    //   slashes: true,
    //   pathname: require('path').join(__dirname, 'index.html')
    // })
    
    // win.loadURL(url)
    // 使用带有网址编码数据的 POST请求​​加载网址:
    // win.loadURL('http://localhost:8000/post', {
    //   postData: [{
    //     type: 'rawData',
    //     bytes: Buffer.from('hello=world')
    //   }],
    //   extraHeaders: 'Content-Type: application/x-www-form-urlencoded'
    // })
    window.loadURL('http://localhost:8081/');
    // webContents是EventEmitter的实例，负责渲染和控制网页，是BrowserWindow对象的一个属性
    window.webContents.openDevTools();
  } else {
    window.loadFile(resolve(__dirname, './index.html'));
  }
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  app.quit();
});
