import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center py-10 px-6">
        <h2 className="text-4xl bg-gradient-to-r from-teal-400 to-teal-600 text-transparent bg-clip-text inline-block">
          404
        </h2>
        <p className="text-lg mt-3 mb-2">Halaman Tidak Ditemukan</p>
        <p className="text-gray-500 mb-6">Halaman yang Anda cari sepertinya tidak ada</p>
        <button
          className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700"
          onClick={() => {
            router.push(`/group-list`);
          }}
        >
          Kembali ke Home
        </button>
      </div>
    </div>
  );
}
