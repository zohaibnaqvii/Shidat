
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
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
  const [error, setError] = useState(false);
  const [hasBookmark, setHasBookmark] = useState(false);

  const story = [
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
    "فارس نے زویا کے لیے گھر میں ہی ایک چھوٹا سا کمرہ پینٹنگ کے لیے بنوا دیا۔ 'اب تم یہاں بیٹھ کر کام کرو۔ باہر کی دنیا تمہارے ٹیلنٹ کو نہیں سمجھ سکتی۔ میں تمہارا پہلا اور آخری فین بننا چاہتا ہوں۔' زویا کو لگا جیسے اس کی زندگی کا دائرہ سکڑ رہا ہے۔",
    "ارحم نے فون کیا تو فارس نے وہ فون توڑ دیا۔ 'وہ دوبارہ تمہیں کیوں فون کر رہا ہے؟ زویا، اگر تم نے اس سے بات کی تو میں خود کو معاف نہیں کر پاؤں گا۔ میری زندگی میں صرف تم ہو اور میں چاہتا ہوں تمہاری زندگی میں بھی صرف میں ہی رہوں۔'",
    "فارس اب گھنٹوں زویا کے پاس بیٹھا رہتا۔ وہ اسے دیکھتا رہتا اور اپنی محبت کا یقین دلاتا۔ 'تم جانتی ہو زویا، مجھے ڈر لگتا ہے کہ کہیں کوئی تمہیں مجھ سے دور نہ کر دے۔ میری محبت جنون بن چکی ہے اور میں اس جنون میں کچھ بھی کر سکتا ہوں۔'",
    "ایک رات زویا نے کہا، 'فارس، مجھے تھوڑی آزادی چاہیے، میں اس طرح نہیں رہ سکتی۔' فارس نے اسے گلے لگایا اور سرگوشی کی، 'تمہاری آزادی مجھ سے شروع ہوتی ہے۔ مجھ سے دور ہو کر تم کہاں جاؤ گی؟ تم میرے عشق کا حصہ ہو اور ہمیشہ رہو گی۔'",
    "ارحم اب شہر میں نظر نہیں آتا تھا۔ فارس نے اسے اتنا ڈرا دیا تھا کہ وہ خاموشی سے چلا گیا۔ جب زویا کو پتہ چلا تو وہ حیران رہ گئی۔ 'آپ نے ایسا کیوں کیا؟' فارس نے جواب دیا، 'میں نے بس ایک کانٹا راستے سے ہٹایا ہے تاکہ تم سکون سے رہ سکو۔'",
    "فارس اب خود زویا کا خیال رکھتا، اسے کھانا کھلاتا اور اس کی ہر ضرورت پوری کرتا۔ 'تمہیں کہیں جانے کی ضرورت نہیں۔ میں تمہارے لیے سب کچھ کروں گا۔ بس تم میرے پاس رہو، یہی میرے لیے کافی ہے۔' اس کا انداز بہت زیادہ گہرا ہو چکا تھا۔",
    "آہستہ آہستہ زویا نے بھی حالات سے سمجھوتہ کر لیا۔ اسے لگا کہ شاید یہی اس کی قسمت ہے۔ فارس کی محبت اسے تکلیف بھی دیتی تھی اور سکون بھی۔ وہ اس کے جنون کی عادی ہونے لگی تھی اور اب اسے باہر کی دنیا اجنبی لگتی تھی۔",
    "ایک سرد رات فارس نے زویا کے نام کی انگوٹھی اسے پہنائی۔ 'یہ ہماری محبت کی نشانی ہے زویا۔ اب کوئی بھی ہمیں الگ نہیں کر سکے گا۔ ہم دونوں ایک دوسرے کے لیے بنے ہیں اور یہ تعلق ہمیشہ قائم رہے گا۔' زویا نے خاموشی سے سر ہلا دیا۔",
    "فارس کی آنکھوں میں اب ایک سکون تھا کیونکہ زویا مکمل طور پر اس کی ہو چکی تھی۔ اس نے زویا کو دنیا سے کاٹ دیا تھا اور اب وہ صرف فارس کی باتیں سنتی تھی۔ ان کا گھر ہی ان کی کل کائنات بن چکا تھا، جہاں کوئی تیسرا نہیں تھا۔",
    "زویا نے آئینے میں خود کو دیکھا تو اسے اپنی پہچان بدلی ہوئی لگی۔ 'فارس، میں کون ہوں؟' فارس نے پیچھے سے آکر اسے پکڑا اور کہا، 'تم میری محبت ہو، تم میری زندگی ہو زویا۔ تم وہ ہو جس کے بغیر میں ادھورا ہوں۔ تم صرف میری ہو، ہمیشہ کے لیے۔'",
    "اب ان کے درمیان زیادہ باتیں نہیں ہوتی تھیں، بس خاموشی اور ایک دوسرے کا ساتھ تھا۔ فارس کی ایک نظر زویا کے لیے کافی ہوتی۔ اس نے اپنی زندگی فارس کے نام کر دی تھی اور فارس نے اسے اپنی دنیا بنا لیا تھا۔ یہ جنون اب انتہا پر تھا۔",
    "وقت گزرتا گیا اور ان کی محبت میں کوئی کمی نہیں آئی۔ فارس اب بھی اسی شدت سے زویا کا خیال رکھتا۔ اس نے گھر کے گرد اونچی دیواریں بنا دی تھیں تاکہ کوئی اندر نہ آسکے۔ ان کی یہ چھوٹی سی دنیا اب مکمل طور پر الگ ہو چکی تھی۔",
    "زویا کو اب فارس کا غصہ برا نہیں لگتا تھا۔ 'اگر آپ مجھ سے اتنی محبت نہ کرتے تو شاید میں کبھی جان نہ پاتی کہ میں کسی کے لیے کتنی ضروری ہوں۔' فارس مسکرایا اور اس کے ہاتھ چوم لیے، 'تم میری ضرورت نہیں، تم میری بقا ہو زویا۔'",
    "ایک بارش والی رات فارس نے زویا کو بالکونی میں کھڑا کیا۔ 'دیکھو یہ بارش، یہ بھی تمہیں چھونا چاہتی ہے اور مجھے حسد ہو رہا ہے۔' زویا ہنسی اور اس کا ہاتھ پکڑ لیا۔ اب وہ فارس کے اس جنون کو سمجھنے لگی تھی اور اسے اس میں سکون ملتا تھا۔",
    "ان کی زندگی اب بہت پرسکون ہو چکی تھی، لیکن یہ سکون صرف ان کے لیے تھا۔ فارس نے زویا کو ہر وہ چیز دی جو وہ چاہتی تھی، بس اسے باہر جانے کی اجازت نہیں تھی۔ زویا کو بھی اب باہر کی دنیا کی کوئی خواہش نہیں رہی تھی۔",
    "داستان کے آخری حصے میں زویا نے ایک ڈائری لکھی۔ 'شدت کا مطلب خود کو مٹا دینا ہے۔ میں نے فارس کی محبت میں خود کو مٹا دیا ہے اور یہی میرا سکون ہے۔' اس نے یہ ڈائری فارس کے لیے چھوڑ دی تاکہ وہ جان سکے کہ وہ کتنی خوش ہے۔",
    "آخر میں فارس نے زویا کا ہاتھ پکڑا اور اسے سینے سے لگا لیا۔ 'ہمارا یہ سفر اب کبھی ختم نہیں ہوگا۔ ہم ایک دوسرے کے ہو چکے ہیں اور کوئی طاقت ہمیں جدا نہیں کر سکتی۔ ہماری یہ شدت ہمیشہ زندہ رہے گی۔' (داستان ختم ہوئی)"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('shiddat_bookmark');
    if (saved !== null) setHasBookmark(true);
  }, []);

  const handlePageChange = (index: number) => {
    if (animating || index < 0 || index >= story.length) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(index);
      localStorage.setItem('shiddat_bookmark', index.toString());
      setAnimating(false);
    }, 400);
  };

  const checkCipher = () => {
    if (password.toLowerCase() === 'zainab') {
      setView('reader');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const resumeJourney = () => {
    const saved = localStorage.getItem('shiddat_bookmark');
    if (saved !== null) setCurrentPage(parseInt(saved));
    setView('password');
  };

  if (view === 'welcome') {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-between bg-black overflow-hidden relative selection:bg-red-800/40">
        <AmbientBackground />
        
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-8 w-full">
          <div className="mb-10 space-y-4 animate-fade-up">
            <span className="text-red-600/60 tracking-[1.2em] font-medium text-[9px] uppercase block mb-4">A Simple Story of Obsession</span>
            <h1 className="text-white text-6xl md:text-9xl font-black tracking-tighter leading-none italic select-none drop-shadow-2xl">SHIDDAT</h1>
            <div className="flex items-center justify-center space-x-8 space-x-reverse mt-4 opacity-50">
               <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-white/50 to-transparent"></div>
               <span className="nastaliq text-3xl text-white font-bold">شدت</span>
               <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 w-full max-w-xs mt-10 animate-fade-up delay-200">
            <button 
              onClick={() => { setView('password'); setCurrentPage(0); }}
              className="group relative px-8 py-5 bg-white hover:bg-red-700 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              <span className="relative z-10 text-black group-hover:text-white font-black tracking-[0.4em] text-[10px] uppercase">Begin Narrative</span>
              <div className="absolute inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            </button>

            {hasBookmark && (
              <button 
                onClick={resumeJourney}
                className="px-8 py-4 border border-white/10 text-white/50 text-[9px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all backdrop-blur-xl"
              >
                Recall Memory
              </button>
            )}

            <button 
              onClick={() => window.print()}
              className="px-8 py-3 text-red-700/50 text-[8px] uppercase tracking-[0.3em] hover:text-red-500 transition-all font-bold"
            >
              Preserve as PDF
            </button>
          </div>
        </div>

        <div className="pb-12 text-center relative z-10 w-full animate-fade-up delay-500">
          <div className="flex flex-col items-center">
            <span className="text-white/10 text-[8px] tracking-[1.8em] uppercase font-bold mb-4">Authored by</span>
            <div className="flex flex-col space-y-2">
              <span className="text-white/90 text-xl font-sans tracking-[0.3em] font-light">ZOHAIB <span className="font-black">NAQVI</span></span>
              <div className="w-10 h-[1px] bg-red-700/30 mx-auto"></div>
              <span className="nastaliq text-white/20 text-lg">زوہیب نقوی</span>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-up { animation: fadeUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-500 { animation-delay: 0.5s; }
        `}</style>
      </div>
    );
  }

  if (view === 'password') {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-black px-8 overflow-hidden relative">
        <AmbientBackground />
        <div className="w-full max-w-xs space-y-12 text-center relative z-10">
          <div className="space-y-4">
            <h2 className="text-white text-3xl font-black tracking-[0.3em] uppercase italic opacity-90">Security Cipher</h2>
            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em]">Credentials Required</p>
          </div>
          
          <div className="relative">
            <input 
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyPress={(e) => e.key === 'Enter' && checkCipher()}
              autoFocus
              className={`w-full bg-transparent border-b border-white/10 py-5 text-center text-4xl focus:outline-none transition-all duration-700 font-sans tracking-[0.4em] ${error ? 'border-red-700 text-red-700 animate-shake' : 'text-white/80 focus:border-red-700'}`}
              placeholder="••••••"
            />
          </div>

          <div className="space-y-4 pt-8">
            <button 
              onClick={checkCipher}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.6em] text-[10px] hover:bg-red-700 hover:text-white transition-all shadow-2xl active:scale-95 duration-500"
            >
              Verify
            </button>
            <button 
              onClick={() => setView('welcome')}
              className="text-white/20 text-[8px] uppercase tracking-[0.5em] hover:text-white transition-colors"
            >
              Back
            </button>
          </div>
        </div>
        <style>{`
          @keyframes shake { 0%, 100% { transform: translateX(0); } 15% { transform: translateX(-10px); } 30% { transform: translateX(10px); } 45% { transform: translateX(-8px); } 60% { transform: translateX(8px); } }
          .animate-shake { animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-black text-white selection:bg-red-800/60 relative overflow-hidden">
      <div className="print-only p-20 bg-white text-black">
        <h1 className="text-7xl font-black text-center mb-4">SHIDDAT</h1>
        <p className="text-center mb-20 text-sm uppercase tracking-[1em] font-light">By ZOHAIB NAQVI</p>
        {story.map((text, idx) => (
          <div key={idx} className="page-break nastaliq mb-20 text-2xl leading-[2.6] text-justify border-b border-gray-100 pb-20">
            <span className="block text-xs font-sans mb-10 opacity-30 uppercase tracking-widest">Part {idx + 1}</span>
            {text}
          </div>
        ))}
      </div>

      <div className="no-print h-full flex flex-col relative z-10">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 z-50">
          <div 
            className="h-full bg-red-700 shadow-[0_0_15px_#dc2626] transition-all duration-700 ease-in-out" 
            style={{ width: `${((currentPage + 1) / story.length) * 100}%` }}
          />
        </div>

        <main className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden">
          <div 
            className={`w-full max-w-4xl transition-all duration-500 ease-out ${animating ? 'opacity-0 scale-95 translate-y-4 blur-sm' : 'opacity-100 scale-100 translate-y-0 blur-0'}`}
          >
            <article 
              className="nastaliq text-white/95 text-center leading-[2.4] md:leading-[2.6] drop-shadow-2xl font-medium"
              style={{
                fontSize: 'clamp(1.2rem, 3.8dvh, 2.5rem)',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 10,
                overflow: 'hidden'
              }}
            >
              {story[currentPage]}
            </article>
          </div>
        </main>

        <nav className="w-full bg-gradient-to-t from-black via-black to-transparent px-6 py-8 md:py-12 border-t border-white/5">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || animating}
              className={`text-white/20 text-[9px] uppercase tracking-[0.4em] font-black transition-all p-3 ${
                currentPage === 0 ? 'opacity-0 pointer-events-none' : 'hover:text-white'
              }`}
            >
              Prev
            </button>

            <div className="flex flex-col items-center">
               <span className="text-red-700 font-black text-2xl md:text-3xl font-sans tracking-tighter leading-none">{String(currentPage + 1).padStart(2, '0')}</span>
               <div className="w-6 h-[1px] bg-white/10 my-2"></div>
               <span className="text-white/10 text-[8px] uppercase tracking-widest">Part {story.length}</span>
            </div>

            {currentPage < story.length - 1 ? (
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={animating}
                className="text-white text-[9px] uppercase tracking-[0.4em] font-black bg-red-800/20 hover:bg-red-700 hover:shadow-[0_0_30px_rgba(185,28,28,0.5)] transition-all px-10 py-4 rounded-none border border-red-700/30 active:scale-95 duration-500"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={() => setView('welcome')}
                className="text-black text-[9px] uppercase tracking-[0.4em] font-black bg-white hover:bg-red-700 hover:text-white transition-all px-10 py-4 rounded-none active:scale-95"
              >
                Finish
              </button>
            )}
          </div>
        </nav>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
            .nastaliq { font-size: 2rem !important; line-height: 2.6 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
