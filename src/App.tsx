import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BG, LOADER_PRIMARY } from './assets';
import Header from './components/Header';
import ReCaptcha from './components/ReCatpcha';
import Sidebar from './components/Sidebar';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';

function App() {
  const [loading, setLoading] = useState(false);
  const [isRecaptchSolved, setIsRecaptchaSolved] = useState(false);

  const onCaptchSolved = () => {
    setIsRecaptchaSolved(true)
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <img src={LOADER_PRIMARY} className="h-16" />
      </div>
    )
  }

  if (!isRecaptchSolved) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <ReCaptcha
          handleCallback={onCaptchSolved}
        />
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <Layout>
            <Step1 />
          </Layout>
        } />
        <Route path='/fill-address' element={
          <Layout>
            <Step2 />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}


const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className='w-full max-w-[1520px] mx-auto h-full min-h-screen bg-white flex flex-col md:flex-row items-start'>
      <div className="hidden md:block relative md:sticky shrink-0 bg-secondary top-0 w-full min-w-[280px] sm:w-[20%] lg:w-[30%] min-h-screen">
        <img src={BG} className="absolute top-0 left-0 w-full object-contain" />
        <Sidebar />
      </div>
      <div className='w-full md:hidden'>
        <Header />
      </div>
      <div className='w-full md:w-[70%] max-w-[1400px] h-full min-h-screen'>
        {children}
      </div>
    </div>
  )
}

export default App;
