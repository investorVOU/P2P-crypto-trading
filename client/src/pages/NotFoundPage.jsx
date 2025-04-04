import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-primary-600 sm:text-8xl">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-secondary-900 dark:text-white sm:text-4xl">Page not found</h2>
        <p className="mt-6 text-base text-secondary-600 dark:text-secondary-400 max-w-md">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="btn btn-primary"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
