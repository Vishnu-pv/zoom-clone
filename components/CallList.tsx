"use client"
import React, {useEffect, useState} from 'react'
import {useGetCalls} from "@/hooks/useGetCalls";
import {useRouter} from "next/navigation";
import {CallRecording} from "@stream-io/video-client";
import {Call} from "@stream-io/video-react-sdk";
import MeetingCard from "@/components/MeetingCard";
import Loader from "@/components/Loader";
import {useToast} from "@/components/ui/use-toast";

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {

    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
    const router = useRouter()
    const [recordings, setRecordings]
        = useState<CallRecording[]>([])
    const getCalls = () => {
        switch (type){
            case 'ended':
                return endedCalls
            case 'recordings':
                return recordings
            case 'upcoming':
                return upcomingCalls
            default:
                return []
        }
    }

    const getNoCallsMessage = () => {
        switch (type){
            case 'ended':
                return 'No Previous Calls!'
            case 'recordings':
                return 'No Recordings!'
            case 'upcoming':
                return 'No Upcoming Calls!'
            default:
                return []
        }
    }
    const calls = getCalls()
    const noCallsMessage = getNoCallsMessage()
    const {toast} = useToast()
    useEffect(() => {
        const fetchRecordings = async () => {
            try{
                const callData = await Promise.all(
                    callRecordings.map((meeting) => meeting.queryRecordings()))
                const recordings =
                    callData.filter(call => call.recordings.length > 0)
                        .flatMap(call => call.recordings)
                setRecordings(recordings)

            }catch (err){
                toast({title: 'Try again Later!'})
            }
        }
        if(type === "recordings") fetchRecordings()
    }, [type, callRecordings]);

    if(isLoading) return <Loader/>

    // @ts-ignore
    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? calls.map((meeting : Call | CallRecording) => (
                <MeetingCard
                    key={(meeting as Call).id}
                    icon={
                        type === 'ended' ?
                            '/icons/previous.svg' :
                            type === 'upcoming' ?
                                '/icons/upcoming.svg'
                                : '/icons/recordings.svg'
                    }
                    title={(meeting as Call).state?.custom?.description?.substring(0,20) ||
                        meeting?.filename?.substring(0,20) || 'Personal Meeting'}
                    date={(meeting as Call).state?.startsAt.toLocaleString() ||
                        (meeting as CallRecording).start_time}
                    isPreviousMeeting={type === 'ended'}
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    buttonText={type === 'recordings' ? 'Play' : 'Start'}
                    handleClick={type === 'recordings' ? () => router.push(`${
                        meeting.url
                    }`) : () => router.push(`/meeting/${meeting.id}`)}
                    link={type === 'recordings' ? meeting.url :
                        `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                />
            )) : (
                <h1>{noCallsMessage}</h1>
            )}
        </div>
    )
}
export default CallList