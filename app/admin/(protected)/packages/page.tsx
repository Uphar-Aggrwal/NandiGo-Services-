import { asc, desc } from "drizzle-orm";
import { deletePackage, deletePackageImage, savePackage } from "@/app/actions/admin";
import { AdminNotice } from "@/components/AdminNotice";
import { SeoFields } from "@/components/admin/SeoFields";
import { getDb } from "@/lib/db";
import { categories as categoryTable, packages, states as stateTable } from "@/lib/db/schema";
import { activityToText, faqsToText, itineraryToText, listToText } from "@/lib/form-parsers";

export const dynamic = "force-dynamic";

type PackageItem = Awaited<ReturnType<typeof getPackageRows>>[number];

async function getPackageRows() {
  return getDb().query.packages.findMany({
    with: { state: true, category: true, images: true },
    orderBy: [desc(packages.updatedAt)]
  });
}

export default async function AdminPackagesPage({
  searchParams
}: {
  searchParams?: { notice?: string; error?: string };
}) {
  const [items, stateRows, categoryRows] = await Promise.all([
    getPackageRows(),
    getDb().query.states.findMany({ where: undefined, orderBy: [asc(stateTable.displayOrder), asc(stateTable.name)] }),
    getDb().query.categories.findMany({
      where: undefined,
      orderBy: [asc(categoryTable.displayOrder), asc(categoryTable.name)]
    })
  ]);

  return (
    <div>
      <p className="eyebrow">Canonical catalog</p>
      <h1 className="page-title">Packages</h1>
      <AdminNotice searchParams={searchParams} />
      <details className="admin-item" open>
        <summary>Create package</summary>
        <PackageForm stateOptions={stateRows} categoryOptions={categoryRows} />
      </details>
      <div className="admin-section">
        {items.map((item) => (
          <details key={item.id} className="admin-item">
            <summary>
              <span>{item.name}</span>
              <span>{item.status}</span>
            </summary>
            <PackageForm item={item} stateOptions={stateRows} categoryOptions={categoryRows} />
            {item.images.length ? (
              <div className="admin-panel">
                <h2>Package images</h2>
                <div className="media-list">
                  {item.images.map((image) => (
                    <form key={image.id} action={deletePackageImage}>
                      <img src={image.url} alt={image.altText} />
                      <input type="hidden" name="id" value={image.id} />
                      <button type="submit" className="button danger">
                        Delete image
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            ) : null}
            <form action={deletePackage}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="button danger">
                Delete package
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

function PackageForm({
  item,
  stateOptions,
  categoryOptions
}: {
  item?: PackageItem;
  stateOptions: Array<typeof stateTable.$inferSelect>;
  categoryOptions: Array<typeof categoryTable.$inferSelect>;
}) {
  return (
    <form action={savePackage} className="admin-panel admin-form">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="field-grid">
        <label>
          Package Name
          <input name="name" defaultValue={item?.name ?? ""} required />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={item?.slug ?? ""} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={item?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label>
          Featured on homepage
          <input name="featured" type="checkbox" defaultChecked={item?.featured ?? false} />
        </label>
      </div>
      <div className="field-grid">
        <label>
          State
          <select name="stateId" defaultValue={item?.stateId ?? ""} required>
            <option value="">Select state</option>
            {stateOptions.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select name="categoryId" defaultValue={item?.categoryId ?? ""} required>
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price
          <input name="price" defaultValue={item?.price ?? ""} />
        </label>
        <label>
          Days to Cover
          <input name="durationDays" type="number" min="1" defaultValue={item?.durationDays ?? 1} />
        </label>
      </div>
      <label>
        Description
        <textarea name="description" defaultValue={item?.description ?? ""} />
      </label>
      <div className="field-grid">
        <label>
          Starting Location
          <input name="startingLocation" defaultValue={item?.startingLocation ?? ""} />
        </label>
        <label>
          Ending Location
          <input name="endingLocation" defaultValue={item?.endingLocation ?? ""} />
        </label>
      </div>
      <label>
        Highlights
        <textarea name="highlights" defaultValue={listToText(item?.highlights)} />
        <span className="help-text">One highlight per line.</span>
      </label>
      <label>
        Day-wise Itinerary
        <textarea name="itinerary" defaultValue={itineraryToText(item?.itinerary)} />
        <span className="help-text">One line per day: Day 1 | Title | Description</span>
      </label>
      <label>
        Activity Table
        <textarea name="activityTable" defaultValue={activityToText(item?.activityTable)} />
        <span className="help-text">One line per row: Time | Activity | Notes</span>
      </label>
      <div className="field-grid">
        <label>
          Inclusions
          <textarea name="inclusions" defaultValue={item?.inclusions ?? ""} />
        </label>
        <label>
          Exclusions
          <textarea name="exclusions" defaultValue={item?.exclusions ?? ""} />
        </label>
        <label>
          Payment Terms
          <textarea name="paymentTerms" defaultValue={item?.paymentTerms ?? ""} />
        </label>
        <label>
          Cancellation & Refund Policy
          <textarea name="cancellationPolicy" defaultValue={item?.cancellationPolicy ?? ""} />
        </label>
      </div>
      <label>
        FAQs
        <textarea name="faqs" defaultValue={faqsToText(item?.faqs)} />
        <span className="help-text">One line per FAQ: Question | Answer</span>
      </label>
      <label>
        Traveller Responsibility
        <textarea name="travellerResponsibility" defaultValue={item?.travellerResponsibility ?? ""} />
      </label>
      <label>
        Google Maps URL
        <input name="mapEmbedUrl" defaultValue={item?.mapEmbedUrl ?? ""} />
      </label>
      <label>
        Package Images
        <input name="images" type="file" accept="image/webp" multiple />
        <span className="help-text">WebP only, 2MB max, 4 images per package total.</span>
      </label>
      <SeoFields item={item} />
      <button className="button" type="submit">
        Save package
      </button>
    </form>
  );
}
