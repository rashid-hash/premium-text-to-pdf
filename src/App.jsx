import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  Download, LayoutTemplate, Building2, BookOpen, 
  ToggleLeft, ToggleRight, Fingerprint, ImagePlus, Trash2, Columns,
  Save, Upload, PanelBottom, Type 
} from 'lucide-react';

const fontOptions = {
  Arabic: [
    { name: 'Cairo (Modern Bold Header)', value: "'Cairo', sans-serif" },
    { name: 'Aref Ruqaa (Calligraphy Header)', value: "'Aref Ruqaa', serif" },
    { name: 'Scheherazade New (Best for Body)', value: "'Scheherazade New', serif" },
    { name: 'Amiri (Classic Print)', value: "'Amiri', serif" },
    { name: 'Noto Naskh Arabic (Standard)', value: "'Noto Naskh Arabic', serif" }
  ],
  Bangla: [
    { name: 'Noto Sans Bengali (Bold & Clean)', value: "'Noto Sans Bengali', sans-serif" },
    { name: 'Tiro Bangla (Traditional Print)', value: "'Tiro Bangla', serif" },
    { name: 'Hind Siliguri (Modern)', value: "'Hind Siliguri', sans-serif" }
  ],
  English: [
    { name: 'Playfair Display (Premium Header)', value: "'Playfair Display', serif" },
    { name: 'PT Serif (Classic Exam)', value: "'PT Serif', serif" },
    { name: 'Inter (Clean & Modern)', value: "'Inter', sans-serif" },
    { name: 'Roboto (Standard)', value: "'Roboto', sans-serif" }
  ]
};

export default function App() {
  const [language, setLanguage] = useState('Arabic');
  const [headerFont, setHeaderFont] = useState("'Cairo', sans-serif");
  const [bodyFont, setBodyFont] = useState("'Scheherazade New', serif");

  const [paperSize, setPaperSize] = useState('A4');
  const [layoutStyle, setLayoutStyle] = useState('standard');
  const [fontSize, setFontSize] = useState(18);
  const [lineSpacing, setLineSpacing] = useState(1.6);

  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);
  const templateInputRef = useRef(null);

  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState('الأَقْصَى النَّمُوذَجِيَّةُ');

  const [showFooter, setShowFooter] = useState(true);
  const [footerText, setFooterText] = useState('مَدْرَسَةُ الأَقْصَى النَّمُوذَجِيَّةُ - ٢٠٢٦');

  // ENHANCED HEADER STATE
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState(''); // New Address Line
  const [examTitle, setExamTitle] = useState('');
  
  const [classLevel, setClassLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [examTime, setExamTime] = useState('');

  const [text, setText] = useState('<p> </p><p><strong> </strong></p><br><p> </p><p> </p>');

  const isRTL = language === 'Arabic';
  
  useEffect(() => {
    if (language === 'Arabic') {
      setHeaderFont("'Cairo', sans-serif");
      setBodyFont("'Scheherazade New', serif");
    } else if (language === 'Bangla') {
      setHeaderFont("'Noto Sans Bengali', sans-serif");
      setBodyFont("'Tiro Bangla', serif");
    } else {
      setHeaderFont("'Playfair Display', serif");
      setBodyFont("'PT Serif', serif");
    }
  }, [language]);

  const getPaperDimensions = () => {
    switch (paperSize) {
      case 'A4': return { width: '210mm', minHeight: '297mm' };
      case 'Letter': return { width: '215.9mm', minHeight: '279.4mm' };
      case 'Legal': return { width: '215.9mm', minHeight: '355.6mm' };
      default: return { width: '210mm', minHeight: '297mm' };
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveTemplate = () => {
    const templateData = {
      language, headerFont, bodyFont, paperSize, layoutStyle, fontSize, lineSpacing, showWatermark, watermarkText,
      schoolName, schoolAddress, examTitle, classLevel, subject, totalMarks, examTime, text, logo, showFooter, footerText
    };
    const blob = new Blob([JSON.stringify(templateData)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Exam_Template_${new Date().getTime()}.json`;
    link.click();
  };

  const loadTemplate = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if(data.language) setLanguage(data.language);
          
          setTimeout(() => {
            if(data.headerFont) setHeaderFont(data.headerFont);
            if(data.bodyFont) setBodyFont(data.bodyFont);
          }, 50);
          
          if(data.paperSize) setPaperSize(data.paperSize);
          if(data.layoutStyle) setLayoutStyle(data.layoutStyle);
          if(data.fontSize) setFontSize(data.fontSize);
          if(data.lineSpacing) setLineSpacing(data.lineSpacing);
          if(data.showWatermark !== undefined) setShowWatermark(data.showWatermark);
          if(data.watermarkText) setWatermarkText(data.watermarkText);
          
          if(data.schoolName) setSchoolName(data.schoolName);
          if(data.schoolAddress !== undefined) setSchoolAddress(data.schoolAddress);
          if(data.examTitle) setExamTitle(data.examTitle);
          if(data.classLevel) setClassLevel(data.classLevel);
          if(data.subject) setSubject(data.subject);
          if(data.totalMarks) setTotalMarks(data.totalMarks);
          if(data.examTime) setExamTime(data.examTime);
          
          if(data.text) setText(data.text);
          if(data.logo) setLogo(data.logo);
          if(data.showFooter !== undefined) setShowFooter(data.showFooter);
          if(data.footerText) setFooterText(data.footerText);
        } catch (error) {
          alert("Invalid template file!");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGeneratePDF = () => {
    window.print();
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#0a0a0f] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0f] to-black font-sans overflow-hidden print:bg-none print:bg-white print:block print:h-auto print:overflow-visible">
      
      {/* Sidebar Controls */}
      <div className="print:hidden w-full lg:w-[480px] h-[45vh] lg:h-screen bg-white/5 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-6 flex flex-col gap-5 overflow-y-auto z-10 shrink-0 custom-scrollbar shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 text-white">
              <LayoutTemplate size={20} />
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Pro Exam Maker</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <input type="file" accept=".json" className="hidden" ref={templateInputRef} onChange={loadTemplate} />
            <button onClick={() => templateInputRef.current.click()} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" title="Load Template"><Upload size={18} /></button>
            <button onClick={saveTemplate} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" title="Save Template"><Save size={18} /></button>
          </div>
        </div>

        {/* Global Settings */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Language</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="English">English</option>
              <option value="Bangla">বাংলা</option>
              <option value="Arabic">العربية</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Paper Size</label>
            <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all" value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
              <option value="A4">A4 Size</option>
              <option value="Letter">US Letter</option>
            </select>
          </div>
        </div>

        {/* DUAL FONT SELECTORS */}
        <div className="bg-black/20 p-4 rounded-xl border border-white/5 shrink-0 space-y-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Type size={14} className="text-amber-400"/> Typography Setup
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Header Font</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-500/50" value={headerFont} onChange={(e) => setHeaderFont(e.target.value)}>
                {fontOptions[language].map((font, idx) => (
                  <option key={`hf-${idx}`} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider">Body Font</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-500/50" value={bodyFont} onChange={(e) => setBodyFont(e.target.value)}>
                {fontOptions[language].map((font, idx) => (
                  <option key={`bf-${idx}`} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formatting Controls */}
        <div className="bg-black/20 p-4 rounded-xl border border-white/5 shrink-0 space-y-4">
          <div className="flex items-center justify-between gap-3">
             <div className="flex-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                  <Columns size={14}/> Layout Style
                </label>
                <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all" value={layoutStyle} onChange={(e) => setLayoutStyle(e.target.value)}>
                  <option value="standard">Standard (1 Column)</option>
                  <option value="mcq">MCQ (2 Columns)</option>
                </select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Font Size</span> <strong className="text-white">{fontSize}px</strong>
                </label>
                <input type="range" min="12" max="36" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-500" />
             </div>
             <div>
                <label className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                  <span>Line Spacing</span> <strong className="text-white">{lineSpacing}</strong>
                </label>
                <input type="range" min="1.0" max="3.0" step="0.1" value={lineSpacing} onChange={(e) => setLineSpacing(Number(e.target.value))} className="w-full accent-emerald-500" />
             </div>
          </div>
        </div>

        {/* ENHANCED Header Details */}
        <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Building2 size={16} className="text-blue-400"/> Header Details</h2>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
            <div className="flex items-center gap-2">
              {logo && <button onClick={() => setLogo(null)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={16} /></button>}
              <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/30">
                <ImagePlus size={14}/> {logo ? 'Change Logo' : 'Add Logo'}
              </button>
            </div>
          </div>
          <input type="text" placeholder="Institution Name" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
          
          {/* New Address Field */}
          <input type="text" placeholder="Address / Location" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
          
          <input type="text" placeholder="Exam Title" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            <input type="text" placeholder="Class" value={classLevel} onChange={(e) => setClassLevel(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
            <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
            <input type="text" placeholder="Total Marks" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
            <input type="text" placeholder="Duration/Time" value={examTime} onChange={(e) => setExamTime(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
          </div>
        </div>

        {/* Footer & Watermark */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
           <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex flex-col justify-center space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-white flex items-center gap-1.5"><PanelBottom size={14} className="text-pink-400"/> Footer</h2>
                <button onClick={() => setShowFooter(!showFooter)} className={`transition-colors ${showFooter ? 'text-pink-400' : 'text-slate-500'}`}>
                  {showFooter ? <ToggleRight size={20}/> : <ToggleLeft size={20} />}
                </button>
              </div>
              {showFooter && <input type="text" value={footerText} onChange={(e) => setFooterText(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-xs text-white outline-none" />}
           </div>
           <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex flex-col justify-center space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-white flex items-center gap-1.5"><Fingerprint size={14} className="text-indigo-400"/> Watermark</h2>
                <button onClick={() => setShowWatermark(!showWatermark)} className={`transition-colors ${showWatermark ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {showWatermark ? <ToggleRight size={20}/> : <ToggleLeft size={20} />}
                </button>
              </div>
              {showWatermark && <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-xs text-white outline-none" />}
           </div>
        </div>

        {/* Rich Text Editor Module */}
        <div className="flex-1 flex flex-col space-y-2 min-h-[300px] shrink-0 bg-white rounded-xl overflow-hidden border border-white/10">
          <div className="bg-slate-800 p-3 flex items-center gap-2 text-white border-b border-white/10">
             <BookOpen size={16} className="text-blue-400"/>
             <span className="text-sm font-semibold">Questions Editor</span>
          </div>
          <div className="flex-1" dir={isRTL ? "rtl" : "ltr"} style={{ fontFamily: bodyFont }}>
            <ReactQuill theme="snow" value={text} onChange={setText} modules={modules} className="h-[200px] text-black" />
          </div>
        </div>

        <button onClick={handleGeneratePDF} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] shrink-0 transition-all mt-4">
          <Download size={20} /> Download PDF
        </button>

        {/* Developer Signature Footer */}
        <div className="mt-8 pt-5 border-t border-white/5 text-center flex flex-col items-center gap-1.5 shrink-0 pb-4">
          <p className="text-[8px] text-slate-500 uppercase tracking-[0.3em]">Crafted with ❤️ by</p>
          <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-wider">
            A. Rashid
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            Full-Stack Web Developer (React, Next.js, Node.js)
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <a href="https://github.com/rashid-hash" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] text-slate-500 border border-white/10 px-2.5 py-1 rounded-full hover:bg-white/10 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              <span>@rashid-hash</span>
            </a>
          </div>
        </div>
      </div>

      {/* Live Preview Workspace */}
      <div className="flex-1 flex items-start justify-center p-4 lg:p-8 overflow-auto print:p-0 print:block print:overflow-visible">
        <div 
          className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden print:shadow-none print:w-full print:min-h-0 print:m-0"
          style={{ 
            ...getPaperDimensions(), 
            boxSizing: 'border-box',
            padding: '18mm', 
            paddingBottom: showFooter ? '38mm' : '18mm'
          }}
        >
          {showWatermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
              <div className="transform -rotate-45 font-bold whitespace-nowrap" style={{ fontSize: '100px', fontFamily: headerFont, color: 'black' }}>
                {watermarkText}
              </div>
            </div>
          )}

          <div className="relative z-10 w-full max-w-full" dir={isRTL ? "rtl" : "ltr"} style={{ color: 'black' }}>
            
            {/* UPDATED HEADER SECTION */}
            <div className="relative text-center border-b-[3px] border-black pb-4 mb-6" style={{ fontFamily: headerFont }}>
              {logo && <img src={logo} alt="Logo" className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-24 h-24 object-contain`} />}
              
              {/* Institution Name */}
              <h1 className="font-bold mb-1 leading-tight" style={{ fontSize: `${fontSize * 1.5}px`, padding: logo ? '0 100px' : '0' }}>{schoolName}</h1>
              
              {/* NEW: Institution Address */}
              {schoolAddress && (
                <h2 className="font-semibold mb-3 leading-tight" style={{ fontSize: `${fontSize * 1.05}px` }}>{schoolAddress}</h2>
              )}
              
              {/* NEW: Exam Title inside a Professional Box */}
              {examTitle && (
                <div className="mb-4">
                  <span 
                    className="inline-block border-[2.5px] border-black px-6 py-1.5 font-bold rounded-lg" 
                    style={{ fontSize: `${fontSize * 1.15}px` }}
                  >
                    {examTitle}
                  </span>
                </div>
              )}

              {/* Class & Subject */}
              <div className="flex justify-between items-center font-bold mt-2" style={{ fontSize: `${fontSize}px` }}>
                <span>{isRTL ? '' : ''}{classLevel}</span>
                <span>{isRTL ? '' : ''}{subject}</span>
              </div>
              
              {/* Time & Marks */}
              <div className="flex justify-between items-center font-bold mt-1.5" style={{ fontSize: `${fontSize * 0.9}px` }}>
                <span>{isRTL ? '' : ''}{examTime}</span>
                <span>{isRTL ? '' : ''}{totalMarks}</span>
              </div>
            </div>

            {/* Main Content Section */}
            <div 
              className="w-full max-w-full break-words whitespace-pre-wrap [&>ul]:list-disc [&>ul]:mx-6 [&>ol]:list-decimal [&>ol]:mx-6 [&>p]:mb-1"
              style={{ 
                fontFamily: bodyFont,
                fontSize: `${fontSize}px`,
                lineHeight: lineSpacing,      
                textAlign: 'justify',
                columnCount: layoutStyle === 'mcq' ? 2 : 1,
                columnGap: '40px',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>

          {/* Footer Section */}
          {showFooter && (
            <div 
              className="hidden print:block fixed bottom-0 left-0 w-full text-center border-t border-black pt-2 pb-2 bg-white z-50"
              style={{ 
                fontFamily: bodyFont, 
                fontSize: `${fontSize * 0.8}px`,
                color: 'black'
              }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {footerText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}