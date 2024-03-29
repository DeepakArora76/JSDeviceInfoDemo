const Observable = require("@nativescript/core").Observable;
const DeviceInfo = require("nativescript-dna-deviceinfo").DeviceInfo;
const requestPermissions = require("nativescript-permissions").requestPermissions;

async function showDeviceInfo() {
  // Ask for permission for iOS.
  if (DeviceInfo.systemManufacturer() === "Apple") {
    let lm = CLLocationManager.alloc().init();
    lm.requestWhenInUseAuthorization();
    lm.startUpdatingLocation();
  }

  console.log("Free memory: ", getSize(DeviceInfo.freeMemory()));
  console.log("Total memory: ", getSize(DeviceInfo.totalMemory()));
  console.log("Total storage space: ", getSize(DeviceInfo.totalStorageSpace()));
  console.log("Free storage space: ", getSize(DeviceInfo.freeStorageSpace()));
  console.log("Device id: ", DeviceInfo.deviceId());
  console.log("Device name: ", DeviceInfo.deviceName());
  console.log("Device locale: ", DeviceInfo.deviceLocale());
  console.log("Device country: ", DeviceInfo.deviceCountry());
  console.log("Device timezone: ", DeviceInfo.timezone());
  console.log("Device user agent: ", await DeviceInfo.userAgent().catch(error => console.log(error)));
  console.log("App name: ", DeviceInfo.appName());
  console.log("App version: ", DeviceInfo.appVersion());
  console.log("App bundle id: ", DeviceInfo.bundleId());
  console.log("App bundle number: ", DeviceInfo.bundleNumber());
  console.log("System manufacturer: ", DeviceInfo.systemManufacturer());
  console.log("Battery level: ", Math.round(DeviceInfo.batteryLevel()));
  console.log("Storage paths: ", DeviceInfo.externalStoragePaths());
  console.log("Storage volume info: ", DeviceInfo.storageVolumes());
  console.log("WiFi SSID: ", DeviceInfo.wifiSSID());
  console.log("Display metrics: ", DeviceInfo.displayMetrics());
  console.log("Mic available: ", DeviceInfo.isMicAvailable());
  console.log("Connected to Bluetooth Headset:", DeviceInfo.isBluetoothHeadsetConnected());
  console.log("Is portrait orientation: ", DeviceInfo.isPortrait());
  console.log("Is tablet: ", DeviceInfo.isTablet());
  console.log("Is 24 hour: ", DeviceInfo.is24Hour());
  console.log("Is emulator: ", DeviceInfo.isEmulator());
  console.log("Is battery charing: ", DeviceInfo.isBatteryCharging());
  console.log("Is Location service enabled: ", await DeviceInfo.isLocationEnabled().catch(error => console.log(error)));
  console.log("Setting audio volume level to 50");
  DeviceInfo.setAudioVolumeLevel(50);
  console.log("Audio output volume level: ", DeviceInfo.audioVolumeLevel());

  if (DeviceInfo.systemManufacturer() !== "Apple") {
    requestPermissions([
      android.Manifest.permission.ACCESS_COARSE_LOCATION,
      android.Manifest.permission.READ_PHONE_STATE
    ], "App requires Location access permissions"
    ).then(
      () => {
        const provider = DeviceInfo.cellularServiceProviders();
        console.log(provider);
      }
    ).catch(error => console.log(error));

    requestPermissions([
      android.Manifest.permission.INTERNET,
      android.Manifest.permission.ACCESS_NETWORK_STATE,
      android.Manifest.permission.ACCESS_WIFI_STATE
    ], "App requires Network permissions"
    ).then(
      () => {
        console.log("WiFi IPv4 Address: ", DeviceInfo.wifiIpv4Address());
        console.log("IP Address:", JSON.stringify(DeviceInfo.dumpIpAddresses(), null, 4));
      }
    ).catch(error => console.log(error));

    requestPermissions([
      android.Manifest.permission.ACCESS_FINE_LOCATION
    ], "App requires Network permissions"
    ).then(
      async () => {
        console.log("Is Bluetooth enabled: ", await DeviceInfo.isBluetoothEnabled().catch(error => console.log(error)));
      }
    ).catch(error => console.log(error));
  }
  else {
    console.log("Is Bluetooth enabled: ", await DeviceInfo.isBluetoothEnabled().catch(error => console.log(error)));
    console.log("WiFi IPv4 Address: ", DeviceInfo.wifiIpv4Address());
    console.log("IP Address:", JSON.stringify(DeviceInfo.dumpIpAddresses(), null, 4));
    const provider = DeviceInfo.cellularServiceProviders();
    console.log(provider);
  }
}

function formatBytes(bytes, decimals) {
  if (bytes === 0) return '0 GB'
  if (isNaN(parseInt(bytes))) return bytes
  if (typeof bytes === 'string') bytes = parseInt(bytes)
  if (bytes === 0) return '0';
  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function getSize(bytes) {
  return formatBytes(bytes, 2);
}

function getMessage(counter) {
  if (counter <= 0) {
    return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
  } else {
    return `${counter} taps left`;
  }
}

function createViewModel() {

  const viewModel = new Observable();
  viewModel.counter = 42;
  viewModel.message = getMessage(viewModel.counter);

  viewModel.onTap = async () => {
    showDeviceInfo().catch(error => console.log(error));
    viewModel.counter--;
    viewModel.set("message", getMessage(viewModel.counter));
  };

  return viewModel;
}

exports.createViewModel = createViewModel;
