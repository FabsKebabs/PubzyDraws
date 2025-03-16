import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Create schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface EntryFormProps {
  onSuccess?: () => void;
  onEntryCountUpdate?: (count: number) => void;
}

export default function EntryForm({ onSuccess, onEntryCountUpdate }: EntryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      acceptTerms: false,
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Submit entry to the API
      const response = await apiRequest("POST", "/api/entries", {
        name: data.name,
        email: data.email,
      });
      
      // Success notification
      toast({
        title: "Entry Submitted!",
        description: "Your entry has been successfully recorded.",
        variant: "default",
      });
      
      // Reset form
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Update entry count if callback provided
      if (onEntryCountUpdate) {
        // Fetch updated count
        const countResponse = await apiRequest("GET", "/api/entries/count");
        const countData = await countResponse.json();
        onEntryCountUpdate(countData.count);
      }
    } catch (error) {
      // Try to extract the error message from the response
      let errorMessage = "There was an error submitting your entry. Please try again.";
      
      if (error instanceof Error) {
        // For network errors or other JavaScript errors
        errorMessage = error.message;
      } else if (error instanceof Response) {
        // For HTTP errors with response body
        try {
          const errorData = await error.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If we can't parse the JSON, use the status text
          errorMessage = error.statusText || errorMessage;
        }
      }
      
      // Error notification with the extracted message
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="cyber-card border-t-4 border-primary">
      <CardHeader>
        <CardTitle className="font-orbitron text-2xl bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Enter the Giveaway
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      className="bg-gray-800 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-300">
                      I agree to the terms and conditions and privacy policy
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
                </>
              ) : (
                "Submit Entry"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}