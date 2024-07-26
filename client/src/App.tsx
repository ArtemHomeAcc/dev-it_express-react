import { Input } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { SubmitButton } from './components/ui/submitButton';
import { limits } from './constants/limits';
import { errorMessage } from './constants/errorMessage';

import { Result } from './types/result';
import { client } from './utils/client';

function App() {
  const [resultList, setResultList] = useState<Result[]>([]);
  const [inputQuantity, setInputQuantity] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (error.length) {
      timer = setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [error]);

  const handleClick = () => {
    if (inputQuantity) {
      setSelectedQuantity(inputQuantity);
    } else {
      setError(errorMessage.emptyInput);
    }
  };

  useEffect(() => {
    if (resultList.length === limits.requestQuantity) {
      setLoading(false);
    }
  }, [resultList]);

  useEffect(() => {
    if (selectedQuantity) {
      setLoading(true);

      if (selectedQuantity > 100 || selectedQuantity < 0) {
        setError(errorMessage.inputValue);
        setLoading(false);

        return;
      }

      const sendARequest = (resolvedRequests = 0) => {
        // next two variables are needed according to point 1.2 test assignment
        let firstRequestTime = Date.now();
        let requestCount = 0;

        const requestsArr = [];
        const nextResolvedRequests = resolvedRequests + selectedQuantity;

        for (let j = resolvedRequests + 1; j <= nextResolvedRequests; j += 1) {
          const nextRequestTime = Date.now();

          // check if there is possibility to send new request;
          if (
            nextRequestTime - firstRequestTime < limits.time &&
            requestCount === selectedQuantity
          ) {
            j -= 1;
            continue;
          }

          // resetting the request count
          if (
            nextRequestTime - firstRequestTime >= limits.time &&
            requestCount === selectedQuantity
          ) {
            firstRequestTime = nextRequestTime;
            requestCount = 0;
          }

          requestsArr.push(client.get<Result>(`/api/${j}`));
        }

        // sending all selected quantity requests
        Promise.all(requestsArr)
          .then((response) => {
            const newList = response.reduce((acc, elem) => {
              acc.push(elem.data);
              return acc;
            }, [] as Result[]);

            setResultList((prevState) => [...prevState, ...newList]);

            // check if all requests are sent
            if (nextResolvedRequests < limits.requestQuantity) {
              sendARequest(nextResolvedRequests);
            }
          })
          .catch(() => {
            setError(errorMessage.loadingFail);
            setLoading(false);
          });
      };

      sendARequest();
    }
  }, [selectedQuantity]);

  return (
    <main className="flex flex-col gap-7 min-h-screen items-center justify-center py-20">
      <div className="flex flex-col gap-5 relative">
        <Input
          name="quantity"
          type="number"
          onChange={(e) => setInputQuantity(+e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleClick();
            }
          }}
          className="rounded-md text-black px-3 py-2"
        />

        <SubmitButton loading={loading} handleClick={handleClick} />

        {!!error.length && (
          <div className="px-3 py-2 min-w-40 rounded-md bg-amber-200 text-orange-600 absolute bottom-[-90px]">
            {error}
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-2 items-center justify-center">
        {resultList.map((result) => (
          <li
            key={result.id}
            className="px-3 py-2 bg-sky-100 text-black rounded-md min-w-20 text-center"
          >
            {result.value}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
