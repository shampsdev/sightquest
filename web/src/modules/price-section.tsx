import decor2 from "@/assets/decor-2.svg"
import decor3 from "@/assets/decor-3.svg"
import { Title } from "@/components/ui/title"

export const PriceSection = () => {
    return (
        <section>
            <Title>
                Цены
            </Title>

            <p className="text-secondary text-xl">
                "SightQuest" предоставляет основной контент без оплаты, чтобы каждый мог насладиться игрой. Для улучшения опыта мы предлагаем следующие внутриигровые покупки:
            </p>

            <div className="py-16 relative">
                <div className="font-light flex h-fit gap-4">
                    <div className="w-full relative bg-[#555555] rounded-3xl overflow-hidden">
                        <p className="absolute top-4 left-4 text-xl xs:text-6xl text-primary">
                            150 ₽
                        </p>

                        <img
                            className="object-cover h-full absolute right-0"
                            src={decor2}
                        />

                        <p className="absolute bottom-4 left-4 xs:text-2xl text-primary">
                            Кастомизация <br />
                            персонажа
                        </p>
                    </div>
                    <div className="w-full gap-4 flex flex-col">
                        <div
                            className="aspect-[3/2] relative col-start-2 row-start-1 bg-[#555555] rounded-3xl overflow-hidden"
                        >
                            <p className="absolute top-4 left-4 text-xl xs:text-6xl text-primary">
                                250 ₽
                            </p>

                            <img
                                className="h-full w-full object-cover"
                                src={decor3}
                            />

                            <p className="absolute bottom-4 left-4 xs:text-3xl text-primary">
                                Ускорения и улучшения
                            </p>
                        </div>
                        <div
                            className="bg-[#555555] aspect-[3/2] relative rounded-3xl overflow-hidden"
                        >
                            <p className="absolute top-4 left-4 text-xl xs:text-6xl text-primary">
                                400 ₽
                            </p>

                            <img
                                className="h-full w-full rotate-180 object-cover"
                                src={decor3}
                            />

                            <p className="absolute bottom-4 left-4 xs:text-3xl text-primary">
                                Эксклюзивные эелементы
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
