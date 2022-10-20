package playlist

import (
	"github.com/grafana/grafana/pkg/kindsys"
	"github.com/grafana/thema"
	"github.com/grafana/thema/vmux"
)

// rootrel is the relative path from the grafana repository root to the
// directory containing the .cue files in which this kind is declared. Necessary
// for runtime errors related to the declaration and/or lineage to provide
// a real path to the correct .cue file.
const rootrel string = "kinds/structured/playlist"

// TODO standard generated docs
type Kind struct {
	lin    thema.ConvergentLineage[*Playlist]
	jendec vmux.Endec
	valmux vmux.ValueMux[*Playlist]
	decl   kindsys.Decl[kindsys.CoreStructuredMeta]
}

// type guard
var _ kindsys.Structured = &Kind{}

// TODO standard generated docs
func NewKind(rt *thema.Runtime, opts ...thema.BindOption) (*Kind, error) {
	decl, err := kindsys.LoadCoreKind[kindsys.CoreStructuredMeta](rootrel, rt.Context(), nil)
	if err != nil {
		return nil, err
	}
	k := &Kind{
		decl: *decl,
	}

	lin, err := decl.Some().BindKindLineage(rt, opts...)
	if err != nil {
		return nil, err
	}

	// Get the thema.Schema that the meta says is in the current version (which
	// codegen ensures is always the latest)
	cursch := thema.SchemaP(lin, k.decl.Meta.CurrentVersion)
	tsch, err := thema.BindType[*Playlist](cursch, &Playlist{})
	if err != nil {
		// Should be unreachable, modulo bugs in the Thema->Go code generator
		return nil, err
	}

	k.jendec = vmux.NewJSONEndec("playlist.json")
	k.lin = tsch.ConvergentLineage()
	k.valmux = vmux.NewValueMux(k.lin.TypedSchema(), k.jendec)
	return k, nil
}

// TODO standard generated docs
func (k *Kind) Name() string {
	return "playlist"
}

// TODO standard generated docs
func (k *Kind) Lineage() thema.Lineage {
	return k.lin
}

// TODO standard generated docs
func (k *Kind) ConvergentLineage() thema.ConvergentLineage[*Playlist] {
	return k.lin
}

// JSONValueMux is a version multiplexer that maps a []byte containing JSON data
// at any schematized dashboard version to an instance of Playlist.
//
// Validation and translation errors emitted from this func will identify the
// input bytes as "dashboard.json".
//
// This is a thin wrapper around Thema's [vmux.ValueMux].
func (k *Kind) JSONValueMux(b []byte) (*Playlist, thema.TranslationLacunas, error) {
	return k.valmux(b)
}

// TODO standard generated docs
func (k *Kind) Maturity() kindsys.Maturity {
	return k.decl.Meta.Maturity
}

// TODO standard generated docs
func (k *Kind) Meta() kindsys.CoreStructuredMeta {
	return k.decl.Meta
}
