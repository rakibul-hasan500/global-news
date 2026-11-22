"use client"
import {
    FiCheckCircle,
    FiEye,
    FiEyeOff,
    FiLock,
    FiMail,
    FiPlus,
    FiShield,
    FiUser,
    FiX
} from "react-icons/fi";
import {FormEvent, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useCreateUserMutation} from "@/redux/services/user/userApi";
import {responseHandler} from "@/utils/responseHandler";
import {IoMdArrowDropdown} from "react-icons/io";
import {createUserSchema} from "@/validation/user.validation";
import {zodErrorHandler} from "@/utils/zodErrorHandler";

function AddUserForm({onClose}: any) {

    // Current User
    const {user} = useSelector((state: any) => state.Auth)



    // Form States
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("USER")



    // Password Visibility States
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)



    // Call Create User API
    const [createUser, {isLoading: createUserLoading}] = useCreateUserMutation()

    // Handle Create User
    const handleCreateUser = async (e: any) => {
        e.preventDefault()

        // Validate
        const validate = createUserSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
            role
        })
        if(!validate?.success) {
            return zodErrorHandler(validate)
        }

        try {
            // Hit Create User API
            const response = await createUser({
                name,
                email,
                password,
                role
            }).unwrap()

            // Reset Form
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setRole("USER")

            // Close Modal
            onClose()

            return responseHandler("S", response?.message)
        } catch (error: any) {
            return responseHandler("E", error?.data?.message)
        }
    }



    // Role Options
    const roles = [
        {value: "USER", label: "User"},
        {value: "JOURNALIST", label: "Journalist"},
        {value: "MODERATOR", label: "Moderator"},
        {value: "EDITOR", label: "Editor"},
        ...(user?.role === "SUPER_ADMIN" ? [
            {value: "ADMIN", label: "Admin"},
            // {value: "SUPER_ADMIN", label: "Super Admin"}
        ] : [])
    ]

    // Role Dropdown State
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)

    // Role Dropdown Ref
    const roleDropdownRef = useRef<HTMLDivElement>(null)

    // Close Role Dropdown On Outside Click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
                setRoleDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className="fixed inset-0 z-5000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    {/* Form Title */}
                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <FiPlus size={20}/>
                        </div>

                        {/* Title */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Add User
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Create a new platform user
                            </p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button type="button" onClick={onClose} disabled={createUserLoading} className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                        <FiX size={18}/>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateUser}>
                    {/* Main Body */}
                    <div className="max-h-[calc(90vh-145px)] overflow-y-auto px-5 py-5">
                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div className="md:col-span-2">
                                {/* Label */}
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Name
                                </label>

                                {/* Input Wrapper */}
                                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-primary">
                                    {/* Icon */}
                                    <FiUser className="shrink-0 text-gray-400"/>

                                    {/* Input */}
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter user name"
                                        required
                                        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                {/* Label */}
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                {/* Input Wrapper */}
                                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-primary">
                                    {/* Icon */}
                                    <FiMail className="shrink-0 text-gray-400"/>

                                    {/* Input */}
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email"
                                        required
                                        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                {/* Label */}
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Role
                                </label>

                                {/* Dropdown Wrapper */}
                                <div ref={roleDropdownRef} className="relative">
                                    {/* Selected Button */}
                                    <button type="button" onClick={() => setRoleDropdownOpen(!roleDropdownOpen)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 transition hover:border-gray-400 focus:border-primary">
                                        {/* Selected Role */}
                                        <div className="flex items-center gap-3">
                                            {/* Icon */}
                                            <FiShield className="shrink-0 text-gray-400"/>

                                            {/* Label */}
                                            <span>
                                                {roles.find((roleItem) => roleItem.value === role)?.label}
                                            </span>
                                        </div>

                                        {/* Arrow */}
                                        <IoMdArrowDropdown size={18} className={`text-gray-500 transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`}/>
                                    </button>

                                    {/* Dropdown */}
                                    {roleDropdownOpen && (
                                        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                            {roles.map((roleItem) => (
                                                <button key={roleItem.value} type="button" onClick={() => {
                                                    setRole(roleItem.value)
                                                    setRoleDropdownOpen(false)
                                                }} className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition hover:bg-gray-100 ${role === roleItem.value ? "bg-primary/10 text-primary" : "text-gray-700"}`}>
                                                    {/* Role Label */}
                                                    <span>
                                                        {roleItem.label}
                                                    </span>

                                                    {/* Selected Icon */}
                                                    {role === roleItem.value && (
                                                        <FiCheckCircle size={16} className="text-primary"/>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                {/* Label */}
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Password
                                </label>

                                {/* Input Wrapper */}
                                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-primary">
                                    {/* Icon */}
                                    <FiLock className="shrink-0 text-gray-400"/>

                                    {/* Input */}
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                    />

                                    {/* Password Visibility */}
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer">
                                        {showPassword ? (
                                            <FiEyeOff size={17}/>
                                        ) : (
                                            <FiEye size={17}/>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                {/* Label */}
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>

                                {/* Input Wrapper */}
                                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-primary">
                                    {/* Icon */}
                                    <FiLock className="shrink-0 text-gray-400"/>

                                    {/* Input */}
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm password"
                                        required
                                        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                    />

                                    {/* Password Visibility */}
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer">
                                        {showConfirmPassword ? (
                                            <FiEyeOff size={17}/>
                                        ) : (
                                            <FiEye size={17}/>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Provider Info */}
                        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-xs text-gray-500">
                                This user will be created with{" "}
                                <span className="font-medium text-gray-700">
                                    CREDENTIALS
                                </span>{" "}
                                authentication.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">
                        {/* Cancel */}
                        <button type="button" onClick={onClose} disabled={createUserLoading} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                            Cancel
                        </button>

                        {/* Create */}
                        <button type="submit" disabled={createUserLoading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                            <FiPlus size={16}/>
                            {createUserLoading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserForm;