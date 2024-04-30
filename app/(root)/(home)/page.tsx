"use client"
import React, {useEffect, useState} from 'react'
import MeetingTypeList from "@/components/MeetingTypeList";

const Home = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const updateDateTime = () => {
        const currentDate = new Date();
        const dateOptions = { dateStyle: 'full' };
        const timeOptions = { hour: '2-digit', minute: '2-digit'};
        // @ts-ignore
        const date = new Intl.DateTimeFormat('en-US',dateOptions).format(currentDate);
        // @ts-ignore
        const time = currentDate.toLocaleTimeString(undefined, timeOptions)
        // @ts-ignore
        setDate(date);
        // @ts-ignore
        setTime(time);
    };

    useEffect(() => {
        // Update date and time immediately when the component mounts
        updateDateTime();

        // Update date and time every second (1000 milliseconds)
        const intervalId = setInterval(updateDateTime, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <section className="flex size-full flex-col gap-10 text-white">
            <div className="h-[300px] w-full rounded-[20px]
            bg-hero bg-cover">
                <div className="flex h-full flex-col
                justify-between max-md:px-5 mad-md:py-8 lg:p-11">
                    <h2 className="glassmorphism
                    max-w-[270px] rounded py-2 text-center text-base
                    font-normal">Upcoming Meeting at: 12:30 PM</h2>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold
                        lg:text-7xl">
                            {time}
                        </h1>
                        <p className="text-lg font-medium
                        text-sky-1 lg:text-2xl">{date}</p>
                    </div>
                </div>
            </div>
            <MeetingTypeList/>
        </section>
    )
}
export default Home
