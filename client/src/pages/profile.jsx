import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/user', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          window.location.href = '/';  // Redirection vers la page de connexion
        } else {
          console.error('Erreur lors de la déconnexion');
        }
      })
      .catch(err => console.error('Erreur de déconnexion:', err));
  };

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Bienvenue, {user.displayName}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div className="space-y-6 text-center">
            <p className="text-lg font-semibold text-gray-900">{user.displayName}</p>
            <p className="text-sm text-gray-500">{user.emails[0].value}</p>

            <button
              onClick={handleLogout}
              className="w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
