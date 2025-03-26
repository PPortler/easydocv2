"use client"

import React from 'react'
import MuiTimeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';

import Link from 'next/link';

interface Sents {
    files: [{ fileName: string, fileType: string, fileURL: string }];
    email: string;
    header: string;
    status: string;
    fromSent: [{
        email: string,
        time: string,
        date: string,
        files: [{ fileName: string, fileType: string, fileURL: string }],
        detail: string;
    }];
}

interface TimelineProps {
    timeLine: Sents | undefined;
}
function Timeline({ timeLine }: TimelineProps) {


    console.log(timeLine);

    console.log("fromSent length:", timeLine?.fromSent.length);

    return (
        <MuiTimeline position="alternate-reverse">
        {timeLine?.fromSent.map((e, index) => (
          <React.Fragment key={index}> {/* ใช้ e.id หรือค่าที่ไม่ซ้ำกันแทน index */}
            <TimelineItem>
              <TimelineOppositeContent color="grey">
                <div>
                  {e.time} น.
                </div>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="success" className="w-10 h-10" />
                <TimelineConnector className="w h-14" />
              </TimelineSeparator>
              <TimelineContent>
                <Typography component="span">
                  <div className="text-md">{index === 0 ? "ส่ง" : "ส่งไปที่"}</div>
                </Typography>
                <div className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className="bg-black py-2 px-4 rounded-lg w-fit flex flex-col gap-1">
                    <Typography>
                      <div className="text-xs text-yellow-200">
                        {e?.email}
                      </div>
                    </Typography>
                    <Typography>
                      <div className="text-xs text-white">
                        ข้อความ: {e?.detail}
                      </div>
                    </Typography>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
            {index === timeLine?.fromSent?.length - 1 && (
              timeLine?.status === "complete" ? (
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Link href="/mailbox" className="py-2 px-4 text-white text-xs rounded-xl bg-[#6f69ea] border">
                      ไปที่กล่องข้อความ
                    </Link>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="success" className="w-10 h-10" />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography component="span">
                      <div className="text-md">ตอบกลับแล้ว</div>
                    </Typography>
                    <Typography>
                      <div className="text-xs text-gray-500">
                        {timeLine?.email}
                      </div>
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ) : (
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="grey" className="w-10 h-10" />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography component="span">
                      <div className="text-md">รอการตอบกลับ</div>
                    </Typography>
                    <Typography>
                      <div className="text-xs text-gray-500">
                        {timeLine?.email}
                      </div>
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )
            )}
          </React.Fragment>
        ))}
      </MuiTimeline>
      

    )
}

export default Timeline
