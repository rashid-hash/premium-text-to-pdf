import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  Download, LayoutTemplate, Building2, BookOpen, 
  ToggleLeft, ToggleRight, Fingerprint, ImagePlus, Trash2, Columns,
  Save, Upload, Maximize
} from 'lucide-react';

export default function App() {
  // Settings State
  const [language, setLanguage] = useState('Arabic');
  const [paperSize, setPaperSize] = useState('A4');
  const [layoutStyle, setLayoutStyle] = useState('standard');
  const [fontSize, setFontSize] = useState(18);

  // Margin State (New)
  const [marginTop, setMarginTop] = useState(20);
  const [marginBottom, setMarginBottom] = useState(20);
  const [marginLeft, setMarginLeft] = useState(20);
  const [marginRight, setMarginRight] = useState(20);

  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);
  const templateInputRef = useRef(null);

  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState('الأَقْصَى النَّمُوذَجِيَّةُ');

  // Exam Header State
  const [schoolName, setSchoolName] = useState('مَدْرَسَةُ الأَقْصَى النَّمُوذَجِيَّةُ');
  const [examTitle, setExamTitle] = useState('الاِمْتِحَانُ السَّنَوِيُّ/ ٢٠٢٦ ه');
  const [classLevel, setClassLevel] = useState('الصَّفُّ الْخَامِسْ');
  const [subject, setSubject] = useState('الدُّرُوْسُ الْعَرَبِيَّةُ');
  const [totalMarks, setTotalMarks] = useState('١٠٠');
  const [examTime, setExamTime] = useState('٣ سَاعَات');

  const [text, setText] = useState('<p>١. اَجِبْ عَشَرَةَ مَعَانِي الْكَلِمَاتِ التَالِيَة</p><p><strong>اَرْكَانٌ ، اِسْتَطَاعَ ، إقَامَةٌ ، نُورُ عُمْرِيْ</strong></p><br><p>٢. تَرْجِمْ أَحَدَ النَّصَّيْنِ الْآتِيَيْنِ</p><p>اَلْأَقْصٰىْ هُوَ أَوَّلُ قِبْلَةٍ صَلَّى نَحْوَهَا النَّبِيِّ...</p>');

  const isRTL = language === 'Arabic';
  
  const getFontFamily = () => {
    switch (language) {
      case 'Arabic': return "'Amiri', serif";
      case 'Bangla': return "'Noto Sans Bengali', sans-serif";
      default: return "'Inter', sans-serif";
    }
  };

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
      language, paperSize, layoutStyle, fontSize, showWatermark, watermarkText,
      schoolName, examTitle, classLevel, subject, totalMarks, examTime, text, logo,
      marginTop, marginBottom, marginLeft, marginRight // Added Margins to Save
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
          if(data.paperSize) setPaperSize(data.paperSize);
          if(data.layoutStyle) setLayoutStyle(data.layoutStyle);
          if(data.fontSize) setFontSize(data.fontSize);
          if(data.showWatermark !== undefined) setShowWatermark(data.showWatermark);
          if(data.watermarkText) setWatermarkText(data.watermarkText);
          if(data.schoolName) setSchoolName(data.schoolName);
          if(data.examTitle) setExamTitle(data.examTitle);
          if(data.classLevel) setClassLevel(data.classLevel);
          if(data.subject) setSubject(data.subject);
          if(data.totalMarks) setTotalMarks(data.totalMarks);
          if(data.examTime) setExamTime(data.examTime);
          if(data.text) setText(data.text);
          if(data.logo) setLogo(data.logo);
          if(data.marginTop !== undefined) setMarginTop(data.marginTop);
          if(data.marginBottom !== undefined) setMarginBottom(data.marginBottom);
          if(data.marginLeft !== undefined) setMarginLeft(data.marginLeft);
          if(data.marginRight !== undefined) setMarginRight(data.marginRight);
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
            <button onClick={() => templateInputRef.current.click()} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" title="Load Template">
              <Upload size={18} />
            </button>
            <button onClick={saveTemplate} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors" title="Save Template">
              <Save size={18} />
            </button>
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

        {/* Custom Margin Settings (NEW) */}
        <div className="bg-black/40 p-4 rounded-xl border border-white/10 shrink-0">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Maximize size={16} className="text-emerald-400"/> Margins (mm)
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 block text-center mb-1 uppercase tracking-wider">Top</label>
              <input type="number" value={marginTop} onChange={(e)=>setMarginTop(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-center text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block text-center mb-1 uppercase tracking-wider">Bottom</label>
              <input type="number" value={marginBottom} onChange={(e)=>setMarginBottom(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-center text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block text-center mb-1 uppercase tracking-wider">Left</label>
              <input type="number" value={marginLeft} onChange={(e)=>setMarginLeft(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-center text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block text-center mb-1 uppercase tracking-wider">Right</label>
              <input type="number" value={marginRight} onChange={(e)=>setMarginRight(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-center text-white outline-none focus:border-emerald-500/50" />
            </div>
          </div>
        </div>

        {/* Layout & Font Size */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="space-y-1.5 bg-black/20 p-3 rounded-xl border border-white/5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
              <Columns size={14}/> Layout Style
            </label>
            <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all" value={layoutStyle} onChange={(e) => setLayoutStyle(e.target.value)}>
              <option value="standard">Standard (1 Column)</option>
              <option value="mcq">MCQ / 2 Columns</option>
            </select>
          </div>
          <div className="space-y-1.5 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
            <label className="flex items-center justify-between text-xs font-medium text-slate-400">
              <span>Font Size: <strong className="text-white">{fontSize}px</strong></span>
            </label>
            <input type="range" min="12" max="36" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-500 mt-2" />
          </div>
        </div>

        {/* Header Details */}
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
          <input type="text" placeholder="Exam Title" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
          
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Class" value={classLevel} onChange={(e) => setClassLevel(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
            <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
            <input type="text" placeholder="Total Marks" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
            <input type="text" placeholder="Duration/Time" value={examTime} onChange={(e) => setExamTime(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
          </div>
        </div>

        {/* Watermark Settings */}
        <div className="bg-black/40 p-4 rounded-xl border border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Fingerprint size={16} className="text-indigo-400"/> Watermark</h2>
            <button onClick={() => setShowWatermark(!showWatermark)} className={`flex items-center gap-2 text-sm font-medium transition-colors ${showWatermark ? 'text-indigo-400' : 'text-slate-500'}`}>
              {showWatermark ? <ToggleRight size={24}/> : <ToggleLeft size={24} />}
            </button>
          </div>
          {showWatermark && (
            <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} dir={isRTL ? "rtl" : "ltr"} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white mt-3 outline-none focus:border-indigo-500/50" />
          )}
        </div>

        {/* Rich Text Editor Module */}
        <div className="flex-1 flex flex-col space-y-2 min-h-[300px] shrink-0 bg-white rounded-xl overflow-hidden border border-white/10">
          <div className="bg-slate-800 p-3 flex items-center gap-2 text-white border-b border-white/10">
             <BookOpen size={16} className="text-blue-400"/>
             <span className="text-sm font-semibold">Questions Editor</span>
          </div>
          <div className="flex-1" dir={isRTL ? "rtl" : "ltr"} style={{ fontFamily: getFontFamily() }}>
            <ReactQuill 
              theme="snow" 
              value={text} 
              onChange={setText} 
              modules={modules}
              className="h-[200px] text-black"
            />
          </div>
        </div>

        <button onClick={handleGeneratePDF} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] shrink-0 transition-all mt-4">
          <Download size={20} /> Download PDF
        </button>
      </div>

      {/* Live Preview Workspace */}
      <div className="flex-1 flex items-start justify-center p-4 lg:p-8 overflow-auto print:p-0 print:block print:overflow-visible">
        <div 
          className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden print:shadow-none print:w-full print:min-h-0 print:m-0"
          style={{ 
            ...getPaperDimensions(), 
            // Applied Custom Margins dynamically here!
            paddingTop: `${marginTop}mm`, 
            paddingBottom: `${marginBottom}mm`, 
            paddingLeft: `${marginLeft}mm`, 
            paddingRight: `${marginRight}mm` 
          }}
        >
          {showWatermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
              <div className="transform -rotate-45 font-bold whitespace-nowrap" style={{ fontSize: '100px', fontFamily: getFontFamily(), color: 'black' }}>
                {watermarkText}
              </div>
            </div>
          )}

          <div className="relative z-10" dir={isRTL ? "rtl" : "ltr"} style={{ fontFamily: getFontFamily(), color: 'black' }}>
            
            {/* Header */}
            <div className="relative text-center border-b-[3px] border-black pb-4 mb-6">
              {logo && <img src={logo} alt="Logo" className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-24 h-24 object-contain`} />}
              
              <h1 className="font-bold mb-1 leading-tight" style={{ fontSize: `${fontSize * 1.5}px`, padding: logo ? '0 100px' : '0' }}>{schoolName}</h1>
              <h2 className="font-semibold mb-2" style={{ fontSize: `${fontSize * 1.2}px` }}>{examTitle}</h2>
              
              <div className="flex justify-between items-center font-bold mt-4" style={{ fontSize: `${fontSize}px` }}>
                <span>{isRTL ? 'الصف: ' : 'Class: '}{classLevel}</span>
                <span>{isRTL ? 'المادة: ' : 'Subject: '}{subject}</span>
              </div>
              
              <div className="flex justify-between items-center font-medium mt-1" style={{ fontSize: `${fontSize * 0.9}px` }}>
                <span>{isRTL ? 'الوقت: ' : 'Time: '}{examTime}</span>
                <span>{isRTL ? 'الدرجة: ' : 'Marks: '}{totalMarks}</span>
              </div>
            </div>

            {/* Smart Rendered Content Layout */}
            <div 
              className="break-inside-avoid [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mr-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mr-6 [&>p]:mb-2"
              style={{ 
                fontSize: `${fontSize}px`,
                lineHeight: '2.0',      
                textAlign: 'justify',
                columnCount: layoutStyle === 'mcq' ? 2 : 1,
                columnGap: '40px'
              }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}