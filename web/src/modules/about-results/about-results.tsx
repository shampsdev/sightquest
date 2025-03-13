import { Title } from '@/components/ui/title';
import { ResultBlock } from './components/time-block';
import { ResultOutput } from './components/result-output';
import phone1 from '@/assets/phone_1.png';
import phone2 from '@/assets/phone_2.png';
import bgArrow from '@/assets/bg-arrow-2.svg';

export const AboutResults = () => {
  return (
    <section className='text-primary'>
      <Title>Отслеживай свои результаты</Title>

      <div className='grid grid-cols-2 grid-rows-1 gap-4'>
        <div>
          <ResultOutput />
          <p className='text-primary pt-4 xs:text-base text-xs'>
            Средняя скорость и время, за котрое ты добираешься до точки
            активности
          </p>
        </div>

        <ResultBlock />
      </div>

      <div className='relative grid grid-cols-2 grid-rows-1 gap-4 mt-12 overflow-hidden'>
        <img className='absolute object-fill w-full' src={bgArrow} />

        <img className='mx-auto z-10' src={phone1} />
        <img className='mx-auto z-10' src={phone2} />
      </div>
    </section>
  );
};
