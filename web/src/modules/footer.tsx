import whiteLogo from '@/assets/white-logo.svg';
import fsiLogo from '@/assets/fsi.png';

export const Footer = () => {
  return (
    <footer className='text-secondary flex flex-col gap-y-2 pb-10'>
      <div className='border-b-4 uppercase py-4 text-xl text-center border-secondary flex flex-col gap-y-4'>
        <h3>
          Присоединяйтесь
          <br /> к тестированию бета-версии
        </h3>

        <h3>оставьте свой email</h3>
      </div>

      <img className='w-3/5 mx-auto py-4' src={whiteLogo} alt='White Logo' />
      
      <div className='flex flex-col gap-y-2'>
        <div className='text-secondary text-center text-xl'>
          <h3>Наш телеграм канал:</h3>
          <h3>
            <a href='https://t.me/shampsdev' target='_blank' rel='noopener noreferrer'>
              @shampsdev
            </a>
          </h3>
        </div>

        <div className='text-center py-4'>
          <h3 className='font-bold'>Контакты</h3>
          <p>Телефон: +7 904 519 55 65</p>
          <p>Email: <a href='mailto:team@shamps.dev'>team@shamps.dev</a></p>
        </div>

        <div className='text-center text-sm leading-6 py-4'>
          <p className='text-2xl font-bold'>
            Проект выполнен при поддержке «Фонда содействия инновациям» в рамках федерального проекта 
            «Платформа университетского технологического предпринимательства».
          </p>

          {/* ВСТАВЛЕННАЯ КАРТИНКА */}
          <div className='py-4'>
            <img className='w-1/2 mx-auto' src={fsiLogo} alt='Фонд содействия инновациям' />
          </div>

          <p className='mt-2'>
            ООО "Шампстех" <br />
            Компания Шампстех осуществляет деятельность в области информационных технологий при поддержке Фонда Содействия Инновациям.
          </p>
          <p className='mt-2'>
            ИНН: 7842225368, КПП: 784201001 <br />
            ГЕНЕРАЛЬНЫЙ ДИРЕКТОР: Дьяконов Александр Владимирович
          </p>
        </div>
      </div>
    </footer>
  );
};
