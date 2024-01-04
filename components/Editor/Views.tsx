'use client';
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Views({
  views,
  snippetId,
  snippetStage,
}: {
  views: number;
  snippetId: string;
  snippetStage: string;
}) {
  const [isPublic, setIsPublic] = useState(snippetStage === "public");
  const session = useSession();

  useEffect(() => {
    // Update the state when the snippetStage prop changes
    setIsPublic(snippetStage === "public");
  }, [snippetStage]);

  // Toggle button for snippet stage (public/private)
  const updateStageSnippet = async () => {
    try {
      // Update the snippet stage in the database
      const updatedSnippet = await prisma.snippet.update({
        where: { id: snippetId },
        data: { stage: snippetStage === "public" ? "private" : "public" },
      });

      // Update the local state based on the updated snippet
      setIsPublic(updatedSnippet.stage === "public");
    } catch (error) {
      console.error("Error updating snippet stage:", error);

      // Display a user-friendly error message
      alert("Failed to update snippet stage. Please try again later.");
    }
  };

  return (
    <>
      <div className={cn("absolute left-6 top-6 text-xs text-greyish/80")}>
        {views.toLocaleString() ?? "?"} views
      </div>
      {session.data?.user && (
      <div className={cn("absolute right-6 top-6 text-xs text-greyish/80")}>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            name="toggle"
            id="toggle"
            checked={isPublic}
            onChange={updateStageSnippet}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="toggle"
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
        <label htmlFor="toggle" className="text-xs text-gray-700">
          {snippetStage}
        </label>
      </div>
      )}
    </>
  );
}
