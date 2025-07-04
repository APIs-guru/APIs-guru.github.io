import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="  py-20 flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <span className="icon big inline-block mb-8">
          <Image
            src="/images/svg/logo-sad.svg"
            alt="APIs.guru logo"
            width={128}
            height={128}
            className="mx-auto"
        
          />
        </span>
        <h1 className="text-4xl font-bold mb-8">404: Page not found</h1>
        <div className=" text-gray-700 max-w-2xl mx-auto leading-relaxed">
          <p className="">
            Sorry, we've misplaced that URL or it's pointing to something
            that doesn't exist. <Link href="/" className="text-blue-600 hover:underline">Head back home</Link> to try finding it
            again.
          </p>
          <p>
            We have moved to the APIs.guru domain recently. Check out
            <a href="https://github.com/APIs-guru/openapi-directory/issues/85" 
               className="text-blue-600 hover:underline ml-1">
              migration guide.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
