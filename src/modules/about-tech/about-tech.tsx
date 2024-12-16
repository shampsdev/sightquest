import { Title } from '@/components/ui/title'
import { Fact, FactProps } from './fact'

const facts: FactProps[] = [
    {
        pretitle: "СЕРВЕРНАЯ МОЩЬ",
        text: `FastAPI позволяет нам строить быстрые и эффективные серверные решения, обеспечивая стабильную работу игры.`,
    },
    {
        pretitle: "ПРОСТОТА И КРАСОТА",
        text: "С помощью React Native мы создаем кроссплатформенные мобильные приложения с простым и элегантным дизайном",
    },
    {
        pretitle: "Стабильность",
        text: "Мы инвестируем в создание мощной и надежной серверной инфраструктуры, которая позволяет нам поддерживать высокий уровень стабильности игры, независимо от нагрузки",
    }
]

export const AboutTech = () => {
    return (
        <section className="text-primary">
            <Title>
                ТЕХНОЛОГИИ
            </Title>
            <p className="uppercase pt-4 text-secondary text-lg xs:text-xl">
                Мы используем современные инструменты <br />
                для создания увлекательных <br />
                и стабильных догонялок
            </p>

            <ul className='divide-y-4 divide-primary pt-2'>
                {facts.map((fact, index) => <li key={index}>
                    <Fact
                        key={index}
                        props={fact}
                        number={index + 1}
                    />
                </li>)}
            </ul>
        </section>
    )
}
