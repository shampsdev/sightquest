import { Button } from '@/components/ui/button';
import { useState } from 'react';
import victor from '@/assets/victor.png';
import textLogo from '@/assets/title.svg';
import Input from '@/components/ui/input';
import { useEmail } from '@/hooks/useEmail';
import React from 'react';

export const Hero = () => {
  const { subscribeEmail } = useEmail();
  const [text, setText] = useState('');
  const [submited, setSubmited] = useState<'default' | 'submited'>('default');

  const submit = () => {
    subscribeEmail(text);
    setSubmited('submited');
  };

  return (
    <section className='flex flex-col gap-y-4'>
      <img className='' src={textLogo} />

      <h3 className='text-2xl text-primary'>
        Догонялки по городу
        <br />с друзьями
      </h3>

      <p className='text-secondary text-lg'>
        Оставьте свою почту, чтобы
        <br />
        протестировать бета-версию
      </p>

      <div className='flex gap-x-2'>
        {
          {
            default: (
              <React.Fragment>
                <Input
                  className='w-full'
                  text={text}
                  placeholder='viktor@sightquest.ru'
                  onChange={(e) => setText(e.target.value)}
                />
                <Button onClick={submit}>Отправить</Button>
              </React.Fragment>
            ),
            submited: (
              <React.Fragment>
                <div className='bg-primary flex justify-center rounded-full w-full xs:px-6 xs:py-4 px-3 py-2'>
                  Спасибо!
                </div>
              </React.Fragment>
            ),
          }[submited]
        }
      </div>

      <img src={victor} />
    </section>
  );
};
