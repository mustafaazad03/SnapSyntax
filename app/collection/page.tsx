import { CollectionCard } from "@/components/Collection/CollectionCard";
import HeroSection from "@/components/Collection/HeroSection";
const collection = () => {
	return (
		<div className="">
			<HeroSection
				image="/SnippetsCollection.jpg"
				title="Find Collections Globally"
				textcolor="text-white"
			/>
			<CollectionCard/>
		</div>
	);
};

export default collection;
