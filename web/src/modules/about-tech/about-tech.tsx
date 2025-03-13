import { Title } from '@/components/ui/title'
import { Fact, FactProps } from './fact'

const facts: FactProps[] = [
    {
        pretitle: "СЕРВЕРНАЯ МОЩЬ",
        text: `Python FastAPI обеспечивает стабильную работу игры, а база данных PostgreSQL надежно хранит пользовательскую информацию. Для кеширования используется Redis.`,
    },
    {
        pretitle: "ПРОСТОТА И КРАСОТА",
        text: "С помощью React Native мы создаем кроссплатформенные мобильные приложения с простым и элегантным дизайном",
    },
    {
        pretitle: "Стабильность",
        text: "Мы создаем надежную серверную инфраструктуру, с помощью docker swarm, traefik и nginx. Все соединения поддерживают защищенный протокол https.",
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
