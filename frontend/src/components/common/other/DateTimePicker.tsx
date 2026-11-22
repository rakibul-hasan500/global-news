"use client"
import {useEffect, useRef, useState} from "react";
import {FaCalendarAlt} from "react-icons/fa";
import {IoIosArrowRoundBack, IoIosArrowRoundForward, IoMdClose} from "react-icons/io";
import {MdArrowDropDown} from "react-icons/md";

function DateTimePicker({selected, setSelected, timeSelect=true, yearFrom=2000, yearTo=3000}: any) {

    // Date Time Picker Opened
    const [dateTimePickerOpened, setDateTimePickerOpened] = useState(false);

    // Date Time Picker Ref
    const dateTimePickerRef: any = useRef(null);




    // Selected Date
    const [selectedDate, setSelectedDate] = useState<any>(null)

    // Set Selected Date
    useEffect(() => {
        if (selected) {
            setSelectedDate(new Date(selected));
        } else {
            const newDate = new Date();
            if (!timeSelect) {
                newDate.setHours(23, 0, 0, 0);
            }
            setSelectedDate(newDate);
        }
    }, [selected, timeSelect]);




    // Months
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    // Prev Month
    const prevMonth = () => {
        const currentMonth = selectedDate?.getMonth()
        const newDate = new Date(selectedDate)
        newDate.setMonth(currentMonth - 1)
        setSelectedDate(newDate)
    }

    // Next Month
    const nextMonth = () => {
        const currentMonth = selectedDate?.getMonth()
        const newDate = new Date(selectedDate)
        newDate.setMonth(currentMonth + 1)
        setSelectedDate(newDate)
    }




    // Year Selector Opened
    const [yearSelectorOpened, setYearSelectorOpened] = useState(false)

    // Year Selector Ref
    const yearSelectorRef: any = useRef(null)




    // Month Selector Opened
    const [monthSelectorOpened, setMonthSelectorOpened] = useState(false)

    // Month Selector Ref
    const monthSelectorRef: any = useRef(null)




    // Weekdays
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    // Get Month Last Date
    const monthLastDate = new Date(selectedDate?.getFullYear(), selectedDate?.getMonth() + 1, 0).getDate()

    // Get Month Start Weekday
    const monthStartWeekday = new Date(selectedDate?.getFullYear(), selectedDate?.getMonth(), 1).getDay()


    // Close Outside Click
    useEffect(() => {
        function handleCloseOutsideClick(e: any) {
            // Date Time Picker
            if(dateTimePickerRef && !dateTimePickerRef?.current?.contains(e.target)) {
                setDateTimePickerOpened(false)
            }

            // Year Selector
            if(yearSelectorRef && !yearSelectorRef?.current?.contains(e.target)) {
                setYearSelectorOpened(false)
            }

            // Month Selector
            if(monthSelectorRef && !monthSelectorRef?.current?.contains(e.target)) {
                setMonthSelectorOpened(false)
            }
        }

        document.addEventListener("click", handleCloseOutsideClick);

        return () => {
            document.removeEventListener("click", handleCloseOutsideClick);
        }
    }, [])


    return (
        <div ref={dateTimePickerRef} className="relative">
            {/* Input Box */}
            <button onClick={()=>setDateTimePickerOpened((prev)=>!prev)} className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded-lg text-sm text-heading outline-none transition cursor-pointer ${dateTimePickerOpened ? "focus:border-primary" : "border-border hover:border-primary/50"}`}>
                {/* Selected */}
                {selected ? `${new Date(selected).toLocaleDateString("en-us", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })}${timeSelect ? ". " + new Date(selected).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }).toUpperCase() : ""}` : `${timeSelect ? "Select date and time" : "Select date"}`}

                {/* Clear Button & Calendar Icon */}
                <div>
                    {/* Clear Button */}
                    {selected && (
                        <button type="button" onClick={() => setSelected(null)} title="Clear selected date" aria-label="Clear selected date" className="absolute right-9 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded bg-red-50 text-red-600 transition cursor-pointer rounded-full">
                            <IoMdClose size={16} />
                        </button>
                    )}

                    {/* Calendar Icon */}
                    <FaCalendarAlt />
                </div>
            </button>

            {/* Selector */}
            {dateTimePickerOpened && (
                <div className="w-full max-w-93.75 h-max absolute top-[calc(100%+4px)] z-4000 left-0 bg-white shadow-2xl rounded-xl">
                    {/* Calendar */}
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Prev */}
                            <button onClick={prevMonth} className="h-9 w-9 flex items-center justify-center text-lg bg-gray-100 rounded-full shadow hover:bg-primary/10 hover:text-primary cursor-pointer">
                                <IoIosArrowRoundBack />
                            </button>

                            {/* Year & Month Picker */}
                            <div className="flex items-center gap-3">
                                {/* Year */}
                                <div ref={yearSelectorRef} className="relative">
                                    {/* Current year */}
                                    <button onClick={() => setYearSelectorOpened((prev: any) => !prev)} className={`flex items-center justify-between px-4 py-2 gap-4 max-w-30 w-full bg-gray-100 border font-semibold text-sm ${yearSelectorOpened ? "border-primary" : "border-border hover:border-primary"}`}>
                                        {new Date(selectedDate).getFullYear()}
                                        <MdArrowDropDown className="text-xl"/>
                                    </button>

                                    {/* Selector */}
                                    {yearSelectorOpened && (
                                        <div className="absolute top-[calc(100%+4px)] left-0 w-full flex flex-col h-50 overflow-y-auto bg-white">
                                            {(()=>{
                                                const years = []
                                                for(let i = yearFrom; i <= yearTo; i++){
                                                    years.push(i)
                                                }
                                                return (
                                                    <>
                                                        {years?.map((year)=>(
                                                            <button onClick={() => {
                                                                const newDate = new Date(selectedDate)
                                                                newDate.setFullYear(year)
                                                                newDate.setDate(1)
                                                                setSelectedDate(newDate)
                                                            }} className={`py-2 text-xs font-medium divide-y divide-border cursor-pointer ${new Date(selectedDate).getFullYear() === year ? "bg-primary text-white" : "hover:bg-primary/10 hover:text-primary"}`}>
                                                                {year}
                                                            </button>
                                                        ))}
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Month */}
                                <div ref={monthSelectorRef} className="relative">
                                    {/* Current year */}
                                    <button onClick={() => setMonthSelectorOpened((prev: any) => !prev)} className={`flex items-center justify-between px-4 py-2 gap-4 max-w-30 w-full bg-gray-100 border font-semibold text-sm ${monthSelectorOpened ? "border-primary" : "border-border hover:border-primary"}`}>
                                        {months[selectedDate.getMonth()]}
                                        <MdArrowDropDown className="text-xl"/>
                                    </button>

                                    {/* Selector */}
                                    {monthSelectorOpened && (
                                        <div className="absolute top-[calc(100%+4px)] left-0 w-full flex flex-col h-50 overflow-y-auto bg-white">
                                            {months?.map((month, index)=>(
                                                <button onClick={() => {
                                                    const newDate = new Date(selectedDate)
                                                    newDate.setMonth(index)
                                                    newDate.setDate(1)
                                                    setSelectedDate(newDate)
                                                }} className={`py-2 text-xs font-medium divide-y divide-border cursor-pointer ${new Date(selectedDate).getMonth() === index ? "bg-primary text-white" : "hover:bg-primary/10 hover:text-primary"}`}>
                                                    {month}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Next */}
                            <button onClick={nextMonth} className="h-9 w-9 flex items-center justify-center text-lg bg-gray-100 rounded-full shadow hover:bg-primary/10 hover:text-primary cursor-pointer">
                                <IoIosArrowRoundForward />
                            </button>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 items-center justify-between gap-2 mt-6">
                            {weekdays.map((weekDay, index) => (
                                <span key={index} className="font-bold text-center text-xs">
                                    {weekDay?.slice(0, 3).toUpperCase()}
                                </span>
                            ))}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-7 items-center justify-items-center justify-between gap-2 mt-6">
                            {(()=>{
                                const dates = []
                                for(let i = 1; i <= monthLastDate; i++){
                                    dates.push(i)
                                }
                                for(let i = 0; i < monthStartWeekday; i++) {
                                    dates.unshift("")
                                }
                                return (
                                    <>
                                        {dates.map((date, index)=>{
                                            // Selected date
                                            const selectedObject = selected ? new Date(selected) : null

                                            const isSelected =
                                                date &&
                                                selectedObject &&
                                                selectedObject.getFullYear() === selectedDate.getFullYear() &&
                                                selectedObject.getMonth() === selectedDate.getMonth() &&
                                                selectedObject.getDate() === date


                                            // Today
                                            const today = new Date()
                                            const isToday =
                                                date &&
                                                today.getFullYear() === selectedDate.getFullYear() &&
                                                today.getMonth() === selectedDate.getMonth() &&
                                                today.getDate() === date

                                            return (
                                                <button key={index} onClick={()=>{
                                                    if(date && typeof date === "number") {
                                                        const newDate = new Date(selectedDate)
                                                        newDate.setDate(date)
                                                        setSelectedDate(newDate)
                                                        setSelected(newDate)
                                                        if(!timeSelect){
                                                            setDateTimePickerOpened(false)
                                                        }
                                                    }
                                                }} className={`text-xs font-medium h-8.5 w-8.5 flex items-center justify-center ${date ? isSelected ? "bg-primary text-white" : isToday ? "bg-primary/20 text-primary cursor-pointer" : "cursor-pointer bg-gray-100 hover:bg-primary/10 hover:text-primary" : ""}`}>
                                                    {date}
                                                </button>
                                            )
                                        })}
                                    </>
                                )
                            })()}
                        </div>
                    </div>

                    {/* Time Select */}
                    {timeSelect && (
                        <div className="border-t border-border px-4 py-4">
                            {/* Selector */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Time Label */}
                                <div>
                                    <p className="text-xs font-medium text-muted">
                                        Time
                                    </p>
                                    <p className="text-sm font-semibold text-heading mt-1 uppercase">
                                        {new Date(selectedDate).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </p>
                                </div>

                                {/* Time Selectors */}
                                <div className="flex items-center gap-2">
                                    {/* Hour */}
                                    <div className="relative group">
                                        {/* Selected */}
                                        <button type="button" className={`w-14 h-10 flex items-center justify-center bg-gray-100 border rounded-lg text-sm font-semibold text-heading cursor-pointer hover:border-primary border-border`}>
                                            {String(new Date(selectedDate).getHours() % 12 || 12).padStart(2, "0")}
                                        </button>

                                        {/* Hour Selector */}
                                        <div className="hidden group-hover:flex flex-col absolute bottom-full left-0 w-14 h-45 overflow-y-auto bg-white border border-border rounded-lg shadow-lg z-20 scrollbar-hide">
                                            {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
                                                <button key={hour} onClick={()=>{
                                                    const newDate = new Date(selectedDate)

                                                    const currentHour = newDate.getHours()
                                                    const isPM = currentHour >= 12

                                                    if(isPM) {
                                                        newDate.setHours(hour === 12 ? 12 : 12 + hour)
                                                    }else{
                                                        newDate.setHours(hour === 12 ? 0 : hour)
                                                    }

                                                    setSelectedDate(newDate)
                                                    setSelected(newDate)
                                                }} type="button" className="w-full py-2 text-xs font-medium hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                    {String(hour).padStart(2, "0")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <span className="text-lg font-semibold text-muted">
                                        :
                                    </span>

                                    {/* Minute */}
                                    <div className="relative group">
                                        {/* Selected */}
                                        <button type="button" className={`w-14 h-10 flex items-center justify-center bg-gray-100 border rounded-lg text-sm font-semibold text-heading hover:border-primary border-border cursor-pointer`}>
                                            {String(new Date(selectedDate).getMinutes()).padStart(2, "0")}
                                        </button>

                                        {/* Minute Selector */}
                                        <div className="hidden group-hover:flex flex-col absolute bottom-full left-0 w-14 h-45 overflow-y-auto bg-white border border-border rounded-lg shadow-lg z-20 scrollbar-hide">
                                            {/* 00 */}
                                            <button onClick={()=>{
                                                const newDate = new Date(selectedDate)
                                                newDate.setMinutes(0)
                                                setSelectedDate(newDate)
                                                setSelected(newDate)
                                            }} type="button" className="w-full py-2 text-xs font-medium hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                00
                                            </button>

                                            {/* 01 - 59 */}
                                            {Array.from({ length: 59 }, (_, index) => index + 1).map((minute) => (
                                                <button key={minute} onClick={()=>{
                                                    const newDate = new Date(selectedDate)
                                                    newDate.setMinutes(minute)
                                                    setSelectedDate(newDate)
                                                    setSelected(newDate)
                                                }} type="button" className="w-full py-2 text-xs font-medium hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                    {String(minute).padStart(2, "0")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AM / PM */}
                                    <div className="relative group">
                                        {/* Selected */}
                                        <button type="button" className={`w-16 h-10 flex items-center justify-center bg-gray-100 border rounded-lg text-sm font-semibold text-heading hover:border-primary border-border cursor-pointer uppercase`}>
                                            {new Date(selectedDate).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            }).split(" ")?.[1]}
                                        </button>

                                        {/* AM / PM Selector */}
                                        <div className="hidden group-hover:flex flex-col absolute bottom-full left-0 w-16 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-20">
                                            {/* AM */}
                                            <button type="button" onClick={()=>{
                                                const newDate = new Date(selectedDate)
                                                const currentHour = newDate.getHours() % 12 || 12
                                                newDate.setHours(currentHour === 12 ? 0 : currentHour)
                                                setSelectedDate(newDate)
                                                setSelected(newDate)
                                            }} className="w-full py-2.5 text-xs font-medium hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                AM
                                            </button>

                                            {/* PM */}
                                            <button type="button" onClick={()=>{
                                                const newDate = new Date(selectedDate)
                                                const currentHour = newDate.getHours() % 12 || 12;
                                                newDate.setHours(currentHour === 12 ? 12 : 12 + currentHour)
                                                setSelectedDate(newDate)
                                                setSelected(newDate)
                                            }} className="w-full py-2.5 text-xs font-medium hover:bg-primary/10 hover:text-primary cursor-pointer">
                                                PM
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button type="button" onClick={()=>{
                                const newDate = new Date(selectedDate)
                                setSelected(newDate)
                                setDateTimePickerOpened(false)
                            }} className="hidden w-full mt-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 cursor-pointer transition">
                                Select Time
                            </button>
                        </div>
                    )}

                    {/* Selected Date & Time */}
                    {timeSelect && (
                        <div className="hidden mx-4 mb-4 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-between">
                            {/* Date */}
                            <div>
                                {/* Label */}
                                <p className="text-[11px] font-medium text-muted uppercase tracking-wide">
                                    Date
                                </p>

                                {/* Date */}
                                <p className="text-sm font-semibold text-heading mt-0.5">
                                    {new Date(selectedDate).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>

                            {/* Time */}
                            <div className="text-right">
                                {/* Label */}
                                <p className="text-[11px] font-medium text-muted uppercase tracking-wide">
                                    Time
                                </p>

                                {/* Time */}
                                <p className="text-sm font-semibold text-primary mt-0.5">
                                    {new Date(selectedDate).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default DateTimePicker;