import { cva, VariantProps } from "class-variance-authority"

const spinnerVarients = cva("border-4 rounded-full animate animate-spin border-brand-200 border-t-brand-700 duration-700",{
    variants:{
        size:{
            sm:"size-4 border-2",
            md:"size-6 border-4",
            lg:"size-8 border-4"
        }
    },
    defaultVariants:{
        size:"md"
    }
})

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVarients> {
    className?:string
}

export const LoadingSpinner = ({size,className}:LoadingSpinnerProps) => {
  return (
    <div className=" flex justify-center items-center">
        <div className={spinnerVarients({size,className})}/>
    </div>
  )
}
