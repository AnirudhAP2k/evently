"use client";

import EventsForm from '@/components/shared/EventsForm'
import axios from 'axios';
import React, { use, useCallback, useEffect, useState } from 'react'
import { FormSuccess } from '@/components/FormSuccess';
import { FormErrors } from '@/components/FormErrors';
import { useSession } from 'next-auth/react';
import { Event, SearchParamProps } from '@/lib/types';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';

const page = ({ params }: { params: Promise<SearchParamProps['params']> }) => {
    const { id } = use(params);
    const [errors, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    const [event, setEvent] = useState<Event>({} as Event);
    const { data } = useSession();

    const userId = data?.user.id as string;

    const getEvent = useCallback(async () => {
        if(!id) {
            setErrors("Event ID missing!");
            return;
        }

        await axios
            .get(`/api/events?id=${id}`)
            .then((response) => {
                setEvent(response.data);
            })
            .catch((error) => {
                const errMessage = error.response?.data?.error || error.message;
                setErrors(errMessage);
            })
    }, [id]);

    useEffect(() => {
        getEvent();
    }, [getEvent]);
    

    useEffect(() => {
        console.log("Event data : ", event);
    }, [event]);

    return (
        <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
                <Image
                    src={event.image || "/assets/images/placeholder.png"}
                    alt="hero image"
                    width={1000}
                    height={1000}
                    className="h-full min-h-[300px] object-cover object-center"
                />

                <div className="flex w-full flex-col gap-8 p-5 md:p-10">
                    <div className="flex flex-col gap-6">
                        <h2 className="h2-bold">{event.title}</h2>
                        
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex gap-3">
                                <p className="p-bold-20 rounded-full bg-greeen-500/10 px-5 py-2 text-green-700">
                                    {event.isFree ? 'FREE' : `$${event.price}`}
                                </p>
                                <p className="p-medium-16 rounded-full bg-gray-500/10 px-4 py-2.5 text-gray-500">
                                    {event.category?.label}
                                </p>
                                <p className="p-medium-18 ml-2 mt-2">
                                    by{' '}
                                    <span className="text-primary-500">{event.organizer?.name}</span>
                                </p>
                            </div>
                        </div>

                        {/* CHECKOUT BUTTON */}

                        <div className="flex flex-col gap-5">
                            <div className="flex gap-2 md:gap-3">
                                <Image
                                    src="/assets/icons/calendar.svg"
                                    alt="calendar"
                                    width={32}
                                    height={32} 
                                />
                                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                                    <p>
                                        {formatDateTime(event.startDateTime).dateOnly} - {' '}
                                        {formatDateTime(event.startDateTime).timeOnly}
                                    </p>
                                    <p>
                                        {formatDateTime(event.endDateTime).dateOnly} - {' '}
                                        {formatDateTime(event.endDateTime).timeOnly}
                                    </p>
                                </div>
                            </div>

                            <div className="p-regular-20 flex items-center gap-3">
                                <Image
                                    src="/assets/icons/location.svg"
                                    alt="location"
                                    width={32}
                                    height={32}
                                />
                                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="p-bold-20 text-gray-600">
                                WHat You'll Learn:
                            </p>
                            <p className="p-medium-16 lg:p-regular-18">
                                {event.description}
                            </p>
                            <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                                {event.url}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default page
