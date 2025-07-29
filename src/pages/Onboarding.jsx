
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Onboarding = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    console.log('📝 Stored user:', storedUser);
    console.log('📝 Stored token:', storedToken);

    if (!storedUser || !storedToken || !storedUser.role) {
      console.error('❌ No user, token, or role found');
      toast.error('Please login and select a role first.');
      navigate('/login');
    } else {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, [navigate]);

  const handleAnswer = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setStep((prev) => prev + 1);
  };

  const handleSkip = () => {
    setStep((prev) => prev + 1);
  };

  const finishOnboarding = async () => {
    if (!user || !token) {
      console.error('❌ Missing user or token');
      toast.error('User or token not found. Please log in again.');
      return;
    }

    console.log('📝 Onboarding answers:', answers);
    try {
      const res = await axios.put(
        `https://workwithtrust-backend.onrender.com/api/users/${user._id}`,
        answers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Onboarding response:', res.data);
      const newUser = { ...user, ...answers };
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', res.data.token || token); // Update token if provided
      setUser(newUser);
      toast.success('🎉 Onboarding complete!');
      navigate(user.role === 'client' ? '/client-dashboard' : '/dashboard');
    } catch (err) {
      console.error('❌ Onboarding error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = err.response?.data?.message || 'Onboarding failed';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  const renderQuestion = () => {
    if (!user) return null;

    const role = user.role;

    if (role === 'freelancer') {
      switch (step) {
        case 1:
          return (
            <QuestionCard
              question="What skills do you offer?"
              placeholder="e.g., Web Development, UI/UX Design"
              field="skills"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 2:
          return (
            <QuestionCard
              question="What's your experience level?"
              options={['Beginner', 'Intermediate', 'Expert']}
              field="experience"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 3:
          return (
            <QuestionCard
              question="What type of gigs are you interested in?"
              placeholder="e.g., Full-time, Part-time, One-time project"
              field="gigType"
              onNext={handleAnswer}
              onSkip={finishOnboarding}
            />
          );
        default:
          return finishOnboarding();
      }
    }

    if (role === 'client') {
      switch (step) {
        case 1:
          return (
            <QuestionCard
              question="What service are you looking for?"
              placeholder="e.g., Logo Design, App Development"
              field="service"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 2:
          return (
            <QuestionCard
              question="What’s your project budget?"
              options={['< $100', '$100–$500', '$500+']}
              field="budget"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 3:
          return (
            <QuestionCard
              question="How soon do you want to start?"
              options={['Immediately', 'In a week', 'Later']}
              field="startTime"
              onNext={handleAnswer}
              onSkip={finishOnboarding}
            />
          );
        default:
          return finishOnboarding();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full text-center transition-all duration-300">
        <h1 className="text-2xl font-bold text-emerald-700 mb-6">
          🧩 Quick Setup
        </h1>
        {renderQuestion()}
      </div>
    </div>
  );
};

const QuestionCard = ({ question, placeholder, options, field, onNext, onSkip }) => {
  const [input, setInput] = useState('');

  return (
    <div>
      <p className="text-lg text-gray-700 mb-4">{question}</p>

      {options ? (
        <select
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6"
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6"
        />
      )}

      <div className="flex justify-between">
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 underline"
        >
          Skip
        </button>
        <button
          onClick={() => onNext(field, input)}
          disabled={!input}
          className={`px-6 py-2 rounded-full text-white ${
            input ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Onboarding;



















/*

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Onboarding = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.role) {
      toast.error("Please login and select a role first.");
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, []);

  const handleAnswer = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setStep((prev) => prev + 1);
  };

  const handleSkip = () => {
    setStep((prev) => prev + 1);
  };

  const finishOnboarding = async () => {
    console.log("📝 Onboarding answers:", answers);
 // toast.success('🎉 Onboarding complete!');
 // navigate('/dashboard');

    try {
      const res =
    await axios.put(`http://localhost:5000/api/users/${user._id}`, answers, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const newUser = { ...user, ...answers };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    toast.success('🎉 Onboarding complete!');
    navigate(user.role === 'client' ? '/client-dashboard' : '/dashboard');
  } catch (err) {
    console.error('Onboarding error:', err);
    toast.error('Onboarding failed');
  }
  };

  const renderQuestion = () => {
    if (!user) return null;

    const role = user.role;

    if (role === 'freelancer') {
      switch (step) {
        case 1:
          return (
            <QuestionCard
              question="What skills do you offer?"
              placeholder="e.g., Web Development, UI/UX Design"
              field="skills"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 2:
          return (
            <QuestionCard
              question="What's your experience level?"
              options={['Beginner', 'Intermediate', 'Expert']}
              field="experience"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 3:
          return (
            <QuestionCard
              question="What type of gigs are you interested in?"
              placeholder="e.g., Full-time, Part-time, One-time project"
              field="gigType"
              onNext={handleAnswer}
              onSkip={finishOnboarding}
            />
          );
        default:
          return finishOnboarding();
      }
    }

    if (role === 'client') {
      switch (step) {
        case 1:
          return (
            <QuestionCard
              question="What service are you looking for?"
              placeholder="e.g., Logo Design, App Development"
              field="service"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 2:
          return (
            <QuestionCard
              question="What’s your project budget?"
              options={['< $100', '$100–$500', '$500+']}
              field="budget"
              onNext={handleAnswer}
              onSkip={handleSkip}
            />
          );
        case 3:
          return (
            <QuestionCard
              question="How soon do you want to start?"
              options={['Immediately', 'In a week', 'Later']}
              field="startTime"
              onNext={handleAnswer}
              onSkip={finishOnboarding}
            />
          );
        default:
          return finishOnboarding();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full text-center transition-all duration-300">
        <h1 className="text-2xl font-bold text-emerald-700 mb-6">
          🧩 Quick Setup
        </h1>
        {renderQuestion()}
      </div>
    </div>
  );
};

const QuestionCard = ({ question, placeholder, options, field, onNext, onSkip }) => {
  const [input, setInput] = useState('');

  return (
    <div>
      <p className="text-lg text-gray-700 mb-4">{question}</p>

      {options ? (
        <select
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6"
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={input}
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6"
        />
      )}

      <div className="flex justify-between">
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 underline"
        >
          Skip
        </button>
        <button
          onClick={() => onNext(field, input)}
          disabled={!input}
          className={`px-6 py-2 rounded-full text-white ${
            input ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
*/