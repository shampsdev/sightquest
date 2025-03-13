import { Title } from '@/components/ui/title'
import decorLine from "@/assets/decor-line.svg"
import { Fact, FactProps } from './fact'

const facts: FactProps[] = [
  {
    pretitle: "меньше",
    text: `АктивнОГО видА\nдеятельности`,
  },
  {
    pretitle: "БОЛЬШЕ",
    text: "монотонностИ\n В развлечениЯХ",
  },
  {
    pretitle: "СТРАДАЕТ",
    text: "культурное\n просвещение",
  }
] 

export const AboutProject = () => {
  return (
    <section className="text-primary">
      <Title>
        О проекте
      </Title>
      <p className="uppercase pt-4 text-secondary text-sm xs:text-base">
        Наш продукт был создан с целью<br/>
        найти решение существующим<br/>
        <span className="text-primary">проблемам 21 века.</span>
      </p>

      <ul className='pt-2'>
        { facts.map((fact, index) => <li key={index}>
          <Fact
            key={index}
            props={fact}
            number={index + 1}
          />
        </li>) }
      </ul>

      <img
        className='mt-4 w-full'
        src={decorLine}
      />
    </section>
  )
}
