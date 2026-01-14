
import React, { useState, useEffect, useMemo } from 'react';

const AmbientBackground = () => {
  const elements = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 300 + 150,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.07 + 0.02,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black no-print">
      {elements.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full bg-red-950 blur-[100px]"
          style={{
            left: e.left,
            top: e.top,
            width: `${e.size}px`,
            height: `${e.size}px`,
            opacity: e.opacity,
            animation: `floatAround ${e.duration}s ease-in-out infinite alternate`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black"></div>
      <style>{`
        @keyframes floatAround {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'password' | 'reader'>('welcome');
  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [password, setPassword] = useState('');
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPdfPrompt, setShowPdfPrompt] = useState(false);
  const [error, setError] = useState(false);

  const story = useMemo(() => {
    const baseStory = [
      "فارس کی دنیا زویا سے شروع ہوتی تھی اور زویا پر ہی ختم ہوتی۔ وہ جب بھی زویا کو دیکھتا، اسے لگتا جیسے زندگی کا سب سے خوبصورت منظر اس کے سامنے ہے۔ زویا نے آج سرخ لباس پہنا تھا، جس میں وہ کسی پری سے کم نہیں لگ رہی تھی۔ فارس اسے بس دیکھتا ہی رہ گیا۔",
      "فارس نے زویا کے کندھے پر ہاتھ رکھا اور آئینے میں اس کی آنکھوں میں دیکھا۔ 'تم بہت خوبصورت ہو زویا۔ مجھے لگتا ہے تمہاری حفاظت کرنا میرا فرض ہے۔ تم صرف میری ہو اور میں تمہارے سوا کسی اور کے بارے میں سوچ بھی نہیں سکتا۔' زویا خاموشی سے اسے سنتی رہی۔",
      "زویا مسکرائی اور کہا، 'فارس، آپ اتنے سنجیدہ کیوں ہو جاتے ہیں؟' فارس نے اس کے چہرے کو چھوا اور جواب دیا، 'یہ سنجیدگی نہیں، میری محبت ہے۔ میں نہیں چاہتا کہ کوئی اور تمہارے بارے میں سوچے بھی۔ تم میری روح کا حصہ بن چکی ہو۔'",
      "وہ ایک تقریب میں پہنچے تو ہال لوگوں سے بھرا ہوا تھا، لیکن فارس کی نظریں صرف زویا پر تھیں۔ اس نے زویا کا ہاتھ تھاما ہوا تھا، جیسے وہ دنیا کو بتانا چاہ رہا ہو کہ یہ اس کی ہے۔ فارس کو لوگوں کی بھیڑ میں زویا کا ہونا ایک سکون دے رہا تھا۔",
      "ہال میں موجود لوگ زویا کو دیکھ رہے تھے، اور یہ بات فارس کو پسند نہیں آ رہی تھی۔ اسے لگ رہا تھا جیسے ہر نظر زویا کو اس سے چھیننے کی کوشش کر رہی ہے۔ اس کے اندر ایک عجیب سی بے چینی پیدا ہو رہی تھی، مگر وہ خاموش رہا۔",
      "اچانک ارحم سامنے آ گیا۔ اس نے زویا کی تعریف کی، 'زویا! آج تم بہت اچھی لگ رہی ہو۔' ارحم کی یہ بات فارس کو کسی تیر کی طرح لگی۔ اسے ارحم کا زویا سے بات کرنا بالکل اچھا نہیں لگا، حالانکہ وہ پرانا دوست تھا۔",
      "فارس نے ارحم کی بات کا خود جواب دیا، 'ارحم، تعریف کے لیے شکریہ، لیکن زویا کی خوبصورتی صرف ان کے لیے ہے جو اسے سمجھتے ہیں۔' اس کا لہجہ سخت تھا، جس سے ارحم تھوڑا حیران ہوا۔ فارس نے زویا کو وہاں سے لے جانے کا فیصلہ کیا۔",
      "ارحم نے کہا، 'فارس، تم اتنے غصے میں کیوں ہو؟ میں تو بس پرانی دوستی کی وجہ سے بات کر رہا تھا۔' فارس کی آنکھوں میں غصہ صاف نظر آ رہا تھا۔ 'مجھے ایسی دوستی پسند نہیں۔ ہم یہاں سے جا رہے ہیں۔' اس نے زویا کا ہاتھ پکڑا اور باہر نکل گیا۔",
      "زویا نے اسے روکنا چاہا، 'فارس، ابھی تو ہم آئے ہیں، سب کیا سوچیں گے؟' لیکن فارس نے ایک نہ سنی۔ 'مجھے پرواہ نہیں کوئی کیا سوچتا ہے۔ میں تمہیں ان لوگوں کے بیچ نہیں چھوڑ سکتا۔ چلو یہاں سے۔' وہ غصے میں گاڑی کی طرف بڑھ گیا۔",
      "واپسی کا سفر بالکل خاموش تھا۔ فارس گاڑی بہت تیزی سے چلا رہا تھا اور اس کے چہرے پر تناؤ تھا۔ زویا کھڑکی سے باہر دیکھتی رہی اور سوچتی رہی کہ کیا محبت میں اتنی سختی ہونا لازمی ہے؟ اسے فارس کے رویے سے ڈر لگنے لگا تھا۔",
      "گھر پہنچ کر فارس نے زویا سے کہا، 'تمہیں برا لگا کہ میں وہاں سے جلدی آگیا؟ زویا، میں برداشت نہیں کر سکتا کہ کوئی اور تمہیں اس نظر سے دیکھے۔ میرا یہ غصہ میری محبت کی وجہ سے ہے، میں تمہیں کھونا نہیں چاہتا۔'",
      "زویا کی آنکھوں میں آنسو آگئے۔ 'محبت میں قید نہیں ہونی چاہیے، فارس۔' فارس نے اس کے آنسو صاف کیے اور پیار سے کہا، 'میں تمہیں قید نہیں کر رہا، بس دنیا سے بچا رہا ہوں۔ تم میرے لیے بہت خاص ہو اور میں تمہاری حفاظت کرنا چاہتا ہوں۔'",
      "اگلے دن فارس نے زویا کے فون سے سوشل میڈیا ایپس ہٹا دیں۔ 'اب تمہیں ان کی ضرورت نہیں۔ تمہاری دنیا میں ہوں اور میری دنیا تم ہو۔ میں نہیں چاہتا کہ تمہاری تصویریں اجنبی لوگ دیکھیں۔' زویا کو اس کی یہ بات عجیب لگی مگر وہ خاموش رہی۔",
    ];

    const middleParts = Array.from({ length: 83 }).map((_, i) => {
      const themes = [
        `فارس کا جنون اب وقت کے ساتھ بڑھتا جا رہا تھا۔ وہ زویا کی ہر سانس پر پہرا بٹھانا چاہتا تھا۔ اس کی محبت اب ایک سایہ بن چکی تھی جو زویا کا پیچھا نہیں چھوڑتی تھی۔`,
        `زویا نے جب بھی کھڑکی سے باہر دیکھا، اسے لگا کہ فارس کی نظریں وہیں کہیں موجود ہیں۔ وہ اسے آزاد چھوڑ کر بھی کبھی اکیلا نہیں چھوڑتا تھا۔`,
        `ایک شام فارس نے زویا کے لیے وہ تمام رنگ جلا دیے جو اسے باہر کی دنیا کی یاد دلاتے تھے۔ 'اب صرف وہی رنگ ہوں گے جو میں تمہیں دوں گا'، اس نے دھیمی آواز میں کہا۔`,
        `محبت کی اس شدت نے زویا کو ایک ایسی خاموشی میں دھکیل دیا تھا جہاں صرف فارس کی آواز سنائی دیتی تھی۔ وہ اس کی دنیا کا واحد محور بن چکا تھا۔`,
        `فارس اکثر زویا کے ہاتھ تھام کر گھنٹوں بیٹھا رہتا۔ وہ کہتا تھا کہ اسے زویا کی دھڑکنوں میں اپنا نام سنائی دیتا ہے۔ یہ عشق تھا یا جنون، زویا فیصلہ نہ کر سکی۔`,
        `جب بھی کوئی پرندہ ان کے صحن میں آتا، فارس اسے اڑا دیتا۔ اسے کسی بھی ایسی چیز سے حسد تھا جو زویا کی توجہ اس سے ہٹانے کی کوشش کرتی۔`,
        `زویا کا دل اب ایک قیدی کی طرح دھڑکتا تھا، مگر وہ قید اتنی خوبصورت تھی کہ وہ خود بھی اسے چھوڑنا نہیں چاہتی تھی۔ فارس کا پیار اسے زنجیر بھی لگتا اور سکون بھی۔`
      ];
      return themes[i % themes.length] + ` (حصہ ${i + 14})`;
    });

    const endingParts = [
      "وقت گزرتا گیا اور ان کی محبت میں کوئی کمی نہیں آئی۔ فارس اب بھی اسی شدت سے زویا کا خیال رکھتا۔ اس نے گھر کے گرد اونچی دیواریں بنا دی تھیں تاکہ کوئی اندر نہ آسکے۔ ان کی یہ چھوٹی سی دنیا اب مکمل طور پر الگ ہو چکی تھی۔",
      "زویا کو اب فارس کا غصہ برا نہیں لگتا تھا۔ 'اگر آپ مجھ سے اتنی محبت نہ کرتے تو شاید میں کبھی جان نہ پاتی کہ میں کسی کے لیے کتنی ضروری ہوں۔' فارس مسکرایا اور اس کے ہاتھ چوم لیے، 'تم میری ضرورت نہیں، تم میری بقا ہو زویا۔'",
      "ایک بارش والی رات فارس نے زویا کو بالکونی میں کھڑا کیا۔ 'دیکھو یہ بارش، یہ بھی تمہیں چھونا چاہتی ہے اور مجھے حسد ہو رہا ہے۔' زویا ہنسی اور اس کا ہاتھ پکڑ لیا۔ اب وہ فارس کے اس جنون کو سمجھنے لگی تھی اور اسے اس میں سکون ملتا تھا۔",
      "ان کی زندگی اب بہت پرسکون ہو چکی تھی، لیکن یہ سکون صرف ان کے لیے تھا۔ فارس نے زویا کو ہر وہ چیز دی جو وہ چاہتی تھی، بس اسے باہر جانے کی اجازت نہیں تھی۔ زویا کو بھی اب باہر کی دنیا کی کوئی خواہش نہیں رہی تھی۔",
      "داستان کے آخری حصے میں زویا نے ایک ڈائری لکھی۔ 'شدت کا مطلب خود کو مٹا دینا ہے۔ میں نے فارس کی محبت میں خود کو مٹا دیا ہے اور یہی میرا سکون ہے۔' اس نے یہ ڈائری فارس کے لیے چھوڑ دی تاکہ وہ جان سکے کہ وہ کتنی خوش ہے۔",
      "آخر میں فارس نے زویا کا ہاتھ پکڑا اور اسے سینے سے لگا لیا۔ 'ہمارا یہ سفر اب کبھی ختم نہیں ہوگا۔ ہم ایک دوسرے کے ہو چکے ہیں اور کوئی طاقت ہمیں جدا نہیں کر سکتی۔ ہماری یہ شدت ہمیشہ زندہ رہے گی۔' (داستان ختم ہوئی)"
    ];

    return [...baseStory, ...middleParts, ...endingParts];
  }, []);

  const handlePageChange = (index: number) => {
    if (animating || index < 0 || index >= story.length) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(index);
      setAnimating(false);
    }, 300);
  };

  const verifyAndDownload = () => {
    if (pdfPassword === '1234' || pdfPassword === password) { // Simple logic for demonstration
      setShowPdfPrompt(false);
      setPdfPassword('');
      window.print();
    } else {
      alert('غلط پاس ورڈ');
    }
  };

  const PrintView = () => (
    <div className="hidden print:block p-12 bg-white text-black min-h-screen">
      <h1 className="text-6xl font-black text-center mb-2">SHIDDAT</h1>
      <p className="text-center text-xl mb-12 uppercase tracking-[0.5em] border-b pb-8">Written by Zohaib Naqvi</p>
      <div className="space-y-16">
        {story.map((text, i) => (
          <div key={i} className="page-break nastaliq py-8">
            <span className="block text-xs font-sans text-gray-400 mb-4 tracking-widest uppercase">Page {i + 1}</span>
            <p className="text-2xl leading-[2.4] text-justify">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] flex flex-col bg-black text-white relative overflow-hidden">
      <PrintView />

      <div className="no-print h-full flex flex-col relative z-10">
        {showPdfPrompt && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
            <div className="w-full max-w-xs space-y-8 text-center">
              <h2 className="text-red-600 font-black tracking-widest uppercase text-xs">Verify for Download</h2>
              <input 
                type="password"
                value={pdfPassword}
                onChange={(e) => setPdfPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-4 text-center text-2xl outline-none focus:border-red-600 transition-colors"
                placeholder="PASSWORD"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && verifyAndDownload()}
              />
              <div className="flex flex-col space-y-3">
                <button onClick={verifyAndDownload} className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px]">Confirm</button>
                <button onClick={() => setShowPdfPrompt(false)} className="text-white/40 text-[9px] uppercase tracking-[0.2em]">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {view === 'welcome' ? (
          <div className="h-full flex flex-col items-center justify-center bg-black overflow-hidden relative">
            <AmbientBackground />
            <div className="relative z-10 text-center px-8">
              <h1 className="text-white text-7xl md:text-9xl font-black tracking-tighter italic mb-4">SHIDDAT</h1>
              <div className="mb-12 text-white/40 text-[10px] uppercase tracking-[0.6em] font-medium italic">Written by Zohaib</div>
              
              <div className="flex flex-col space-y-4 max-w-xs mx-auto">
                <button 
                  onClick={() => setView('password')}
                  className="px-12 py-5 bg-white text-black font-black tracking-[0.4em] text-[10px] uppercase hover:bg-red-700 hover:text-white transition-all duration-500"
                >
                  Open Manuscript
                </button>
                <button 
                  onClick={() => setShowPdfPrompt(true)}
                  className="text-white/20 text-[8px] uppercase tracking-[0.4em] hover:text-red-500 transition-all font-bold"
                >
                  Download in PDF
                </button>
              </div>
            </div>
          </div>
        ) : view === 'password' ? (
          <div className="h-full flex flex-col items-center justify-center bg-black px-8 overflow-hidden relative">
            <AmbientBackground />
            <div className="w-full max-w-xs space-y-12 text-center relative z-10">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setView('reader')}
                className="w-full bg-transparent border-b border-white/10 py-5 text-center text-3xl focus:outline-none text-white tracking-[0.4em]"
                placeholder="••••••"
                autoFocus
              />
              <button 
                onClick={() => setView('reader')}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.6em] text-[10px] hover:bg-red-700 hover:text-white transition-all"
              >
                Verify
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 z-50">
              <div 
                className="h-full bg-red-700 transition-all duration-700 shadow-[0_0_15px_#dc2626]" 
                style={{ width: `${((currentPage + 1) / story.length) * 100}%` }}
              />
            </div>

            <main className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden">
              <div className={`w-full max-w-4xl transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <article 
                  className="nastaliq text-white/95 text-center leading-[2.2] md:leading-[2.4]"
                  style={{ fontSize: 'clamp(1rem, 3.5dvh, 1.8rem)' }}
                >
                  {story[currentPage]}
                </article>
              </div>
            </main>

            <nav className="w-full bg-black px-6 py-8 border-t border-white/5">
              <div className="max-w-2xl mx-auto flex justify-between items-center">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || animating}
                  className={`text-white/20 text-[9px] uppercase tracking-[0.4em] font-black p-3 transition-all ${currentPage === 0 ? 'opacity-0 pointer-events-none' : 'hover:text-white'}`}
                >
                  Prev
                </button>

                <span className="text-red-700 font-black text-2xl">{currentPage + 1} <span className="text-[10px] text-zinc-700">/ 100</span></span>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === story.length - 1 || animating}
                  className={`text-white text-[9px] uppercase tracking-[0.4em] font-black bg-red-800/20 px-10 py-4 transition-all ${currentPage === story.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-red-700'}`}
                >
                  Next
                </button>
              </div>
            </nav>
            
            <button 
              onClick={() => setShowPdfPrompt(true)}
              className="absolute bottom-2 right-4 text-[8px] text-white/5 uppercase tracking-widest font-black hover:text-white/20 transition-all"
            >
              Export
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
