import Bots from "@/components/Bots";
import Categories from "@/components/Categories"
import SearchInput from "@/components/SearchInput"
import prismadb from "@/lib/prismadb"

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  }
}

async function RootPage({
  searchParams
}: RootPageProps) {
  const data = await prismadb.bot.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        contains: searchParams.name,
        mode: "insensitive"
      }
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        }
      }
    }
  })


  const categories = await prismadb.category.findMany()

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Bots data={data} />
    </div>
  )
}

export default RootPage