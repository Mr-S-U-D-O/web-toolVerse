import React, { useState, useRef, useEffect, useMemo } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Download, Image as ImageIcon, Wifi, Link, UserCircle, Settings, Palette, QrCode } from 'lucide-react';

type Tab = 'text' | 'wifi' | 'vcard';

export default function QrCodeStudioTool({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('text');

  // URL / Text state
  const [textData, setTextData] = useState('https://toolcabinet.com');

  // Wi-Fi state
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // VCard state
  const [vcFirstName, setVcFirstName] = useState('');
  const [vcLastName, setVcLastName] = useState('');
  const [vcPhone, setVcPhone] = useState('');
  const [vcEmail, setVcEmail] = useState('');
  const [vcCompany, setVcCompany] = useState('');
  const [vcWebsite, setVcWebsite] = useState('');
  const [vcAddress, setVcAddress] = useState('');

  // Design state
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed QR value
  const qrValue = useMemo(() => {
    if (activeTab === 'text') {
      return textData || ' ';
    }
    if (activeTab === 'wifi') {
      const escape = (str: string) => str.replace(/([\\;:])/g, '\\$1');
      const ssid = escape(wifiSsid);
      const pass = escape(wifiPassword);
      const hidden = wifiHidden ? 'true' : 'false';
      return `WIFI:T:${wifiEncryption};S:${ssid};P:${pass};H:${hidden};;`;
    }
    if (activeTab === 'vcard') {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${vcLastName};${vcFirstName};;;`,
        `FN:${vcFirstName} ${vcLastName}`.trim(),
        vcCompany && `ORG:${vcCompany}`,
        vcPhone && `TEL:${vcPhone}`,
        vcEmail && `EMAIL:${vcEmail}`,
        vcWebsite && `URL:${vcWebsite}`,
        vcAddress && `ADR:;;${vcAddress};;;;`,
        'END:VCARD'
      ];
      return lines.filter(Boolean).join('\n');
    }
    return ' ';
  }, [activeTab, textData, wifiSsid, wifiPassword, wifiEncryption, wifiHidden, vcFirstName, vcLastName, vcPhone, vcEmail, vcCompany, vcWebsite, vcAddress]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSVG = () => {
    const svgElement = document.getElementById('qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode_${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const canvas = document.getElementById('qr-canvas-high-res') as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col relative z-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="Back to Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-on-surface flex items-center gap-2">
            <QrCode className="w-6 h-6 text-[#008cff]" />
            QR Code Studio
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Generate 100% free, static, never-expiring QR codes completely offline.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Settings */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6">
          
          {/* Data Tabs */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold font-heading tracking-wider uppercase text-on-surface-variant mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Content Type
            </h2>
            
            <div className="flex p-1 bg-surface-container rounded-lg mb-6">
              {[
                { id: 'text', label: 'URL / Text', icon: Link },
                { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                { id: 'vcard', label: 'Contact', icon: UserCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-surface-container-low text-[#008cff] shadow-sm ring-1 ring-outline-variant/50' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Forms */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Website URL or Plain Text</label>
                    <textarea 
                      value={textData}
                      onChange={(e) => setTextData(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all font-mono text-sm resize-y min-h-[120px]"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'wifi' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Network Name (SSID)</label>
                      <input 
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                        placeholder="MyHomeNetwork"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Password</label>
                      <input 
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                        placeholder="SecretPassword123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Encryption</label>
                      <select 
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all appearance-none"
                      >
                        <option value="WPA">WPA/WPA2/WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer mt-7">
                        <input 
                          type="checkbox"
                          checked={wifiHidden}
                          onChange={(e) => setWifiHidden(e.target.checked)}
                          className="w-5 h-5 rounded border-outline-variant text-[#008cff] focus:ring-[#008cff] bg-surface-container"
                        />
                        <span className="text-sm font-medium text-on-surface">Hidden Network</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vcard' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">First Name</label>
                      <input 
                        type="text"
                        value={vcFirstName}
                        onChange={(e) => setVcFirstName(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Last Name</label>
                      <input 
                        type="text"
                        value={vcLastName}
                        onChange={(e) => setVcLastName(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Phone Number</label>
                      <input 
                        type="tel"
                        value={vcPhone}
                        onChange={(e) => setVcPhone(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Email Address</label>
                      <input 
                        type="email"
                        value={vcEmail}
                        onChange={(e) => setVcEmail(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Company</label>
                      <input 
                        type="text"
                        value={vcCompany}
                        onChange={(e) => setVcCompany(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Website</label>
                      <input 
                        type="url"
                        value={vcWebsite}
                        onChange={(e) => setVcWebsite(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-on-surface mb-1.5">Address</label>
                      <textarea 
                        value={vcAddress}
                        onChange={(e) => setVcAddress(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:border-transparent transition-all resize-none min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Design & Colors */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold font-heading tracking-wider uppercase text-on-surface-variant mb-6 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Design & Colors
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Foreground Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-outline shadow-sm flex-shrink-0">
                    <input 
                      type="color" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={fgColor} 
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Background Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-outline shadow-sm flex-shrink-0">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Error Correction Level</label>
                <select 
                  value={errorCorrectionLevel}
                  onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L'|'M'|'Q'|'H')}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff] appearance-none"
                >
                  <option value="L">Low (~7%)</option>
                  <option value="M">Medium (~15%)</option>
                  <option value="Q">Quartile (~25%)</option>
                  <option value="H">High (~30%) - Best for Logos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Center Logo</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {logoImage ? (
                  <div className="flex items-center gap-3">
                    <img src={logoImage} alt="Logo preview" className="w-10 h-10 object-contain bg-surface-container rounded border border-outline-variant" />
                    <button 
                      onClick={removeLogo}
                      className="text-sm text-red-500 hover:text-red-600 hover:underline font-medium"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-highest border border-outline-variant border-dashed rounded-lg px-4 py-2.5 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Upload Logo
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Preview & Export */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col items-center shadow-sm sticky top-6">
            
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-8 w-full max-w-[320px] aspect-square flex items-center justify-center relative overflow-hidden transition-all group">
               {/* Primary Display SVG */}
               <QRCodeSVG
                 id="qr-svg"
                 value={qrValue}
                 size={288} // large enough to be crisp
                 bgColor={bgColor}
                 fgColor={fgColor}
                 level={errorCorrectionLevel}
                 includeMargin={false}
                 imageSettings={logoImage ? {
                   src: logoImage,
                   x: undefined,
                   y: undefined,
                   height: 64,
                   width: 64,
                   excavate: true,
                 } : undefined}
                 className="w-full h-full"
               />
               
               {/* Hidden High-Res Canvas for PNG Export */}
               <div className="hidden">
                 <QRCodeCanvas
                   id="qr-canvas-high-res"
                   value={qrValue}
                   size={1024}
                   bgColor={bgColor}
                   fgColor={fgColor}
                   level={errorCorrectionLevel}
                   includeMargin={true}
                   imageSettings={logoImage ? {
                     src: logoImage,
                     x: undefined,
                     y: undefined,
                     height: 228,
                     width: 228,
                     excavate: true,
                   } : undefined}
                 />
               </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={downloadPNG}
                className="w-full flex items-center justify-center gap-2 bg-[#008cff] text-white hover:bg-[#0070cc] font-medium tracking-wide px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                Download High-Res PNG
              </button>
              <button 
                onClick={downloadSVG}
                className="w-full flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-highest border border-outline-variant text-on-surface font-medium tracking-wide px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                Download Vector SVG
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
