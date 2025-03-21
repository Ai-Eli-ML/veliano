"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type { Database } from '@/types/supabase'

export function AvatarUpload({ userId }: { userId: string }) {
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const handleUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (error) throw error
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.path })
        .eq('id', userId)

      if (updateError) throw updateError
      
      toast({ title: "Avatar updated successfully" })
      return data.path

    } catch (error: unknown) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive"
      })
      throw error
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        className="hidden"
        id="avatar-upload"
      />
      <Button asChild variant="outline">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          Upload New Avatar
        </label>
      </Button>
    </div>
  )
}