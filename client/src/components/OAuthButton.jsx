import { useEffect, useState } from 'react';

const config = {
  clientId: 'test_client',
  clientSecret: 'test_secret',
  redirectUri: 'http://localhost:5173/callback',
  authEndpoint: 'http://localhost:3000/oauth/authorize',
  tokenEndpoint: 'http://localhost:3000/oauth/token',
  userInfoEndpoint: 'http://localhost:3000/oauth/userinfo'
};

export default function OAuthButton() {
  const [error, setError] = useState(null);
  useEffect(() => {
    // Vérifier si nous revenons d'une redirection OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCode(code);
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const startAuth = () => {
    const authUrl = `${config.authEndpoint}?` + new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'read'
    });
    window.location.href = authUrl;
  };

  const exchangeCode = async (code) => {
    setError(null);
    try {
      const response = await fetch(config.tokenEndpoint, {
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

      const tokens = await response.json();
      
      if (tokens.error) {
        console.error('OAuth error:', tokens);
        setError(`${tokens.error}: ${tokens.error_description}`);
        return;
      }
      
      // Stocker les tokens dans le localStorage
      localStorage.setItem('oauth_tokens', JSON.stringify(tokens));
      
      // Récupérer les informations utilisateur
      const userInfo = await getUserInfo(tokens.access_token);
      console.log('User Info:', userInfo);
    } catch (error) {
      console.error('Erreur lors de l\'échange:', error);
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch(config.userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des infos:', error);
      return null;
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={startAuth}
        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
      >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
      </svg>
        <span className="text-sm font-semibold leading-6">
          Se connecter avec OAuth
        </span>
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
