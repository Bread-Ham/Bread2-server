import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const config = {
  clientId: 'test_client',
  clientSecret: 'test_secret',
  tokenEndpoint: 'http://localhost:3000/oauth/token',
  userInfoEndpoint: 'http://localhost:3000/oauth/userinfo'
};

export default function OAuthCallback() {
  const [status, setStatus] = useState('loading');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setError('Code d\'autorisation manquant');
          setStatus('error');
          return;
        }

        // Échanger le code contre des tokens
        const tokenResponse = await fetch(config.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code: code,
            client_id: config.clientId,
            client_secret: config.clientSecret
          })
        });

        const tokens = await tokenResponse.json();

        if (tokens.error) {
          setError(`${tokens.error}: ${tokens.error_description}`);
          setStatus('error');
          return;
        }

        // Stocker les tokens
        localStorage.setItem('oauth_tokens', JSON.stringify(tokens));

        // Récupérer les informations utilisateur
        const userResponse = await fetch(config.userInfoEndpoint, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`
          }
        });

        const userInfo = await userResponse.json();
        setUserInfo(userInfo);
        setStatus('success');

        // Rediriger après 3 secondes
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        setError('Une erreur est survenue lors de l\'authentification');
        setStatus('error');
      }
    };

    handleCallback();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authentification en cours...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Erreur d'authentification</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Authentification réussie</h3>
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              Continuer en tant que <span className="font-medium text-gray-900">{userInfo?.username}</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">{userInfo?.email}</p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Redirection automatique dans quelques secondes...
          </p>
        </div>
      </div>
    </div>
  );
}
